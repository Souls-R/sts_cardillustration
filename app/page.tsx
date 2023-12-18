"use client"

import { CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import React, { useState } from 'react';
import ImageCard from "@/components/component/image_card"
import JSZip from "jszip"
import { saveAs } from 'file-saver';
import { Dialog } from "@headlessui/react"
import { CardMask, CardType } from "@/lib/cardmask"



export default function Home() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [imageCards, setImageCards] = useState([]);

  //文件选择
  const handleImageChange = (e: any) => {
    const files = Array.from(e.target.files);
    const fileReaders = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ name: (file as File).name, url: reader.result });
        reader.onerror = reject;
        reader.readAsDataURL(file as Blob);
      });
    });
    Promise.all(fileReaders)
      .then(images => {
        let temp: any = [];
        images.map((image: any, index) => (
          temp.push(<ImageCard key={index} image={image} index={index} />)
        ))
        if (temp.length == 0) {
          return
        }
        setImageCards(temp);
      })
      .catch(error => console.error(error));
  };


  //导出图片
  const exportImages = () => {
    setDialogOpen(true)
    if (imageCards.length == 0) {
      return
    }
    const zip = new JSZip();
    imageCards.forEach((i: any) => {
      console.log(i.props.image.name, i.props.image.croped)
      if (!i.props.image.croped || i.props.image.type == CardType.Unknown) {
        //跳过未裁剪的图片
        return
      }
      //挑选mask
      let mask;
      let mask_p;
      if (i.props.image.type == CardType.Attack) {
        mask = CardMask.AttackMask;
        mask_p = CardMask.AttackMask_p;
      }
      else if (i.props.image.type == CardType.Power) {
        mask = CardMask.PowerMask;
        mask_p = CardMask.PowerMask_p;
      }
      else if (i.props.image.type == CardType.Skill) {
        mask = CardMask.SkillMask;
        mask_p = CardMask.SkillMask_p;
      }
      //创建一个img标签作为canvas的源图像
      const cardimgElement = document.createElement('img');
      cardimgElement.src = i.props.image.cropImage;
      const maskedImage = applyMask(cardimgElement, mask!)
      const maskedImage_p = applyMask(cardimgElement, mask_p!, 500, 380)
      //将jpg后缀改为png
      if (i.props.image.name.endsWith('.jpg')) {
        i.props.image.name = i.props.image.name.replace('.jpg', '.png')
      }
      zip.file(i.props.image.name.replace('.png', '_p.png'), maskedImage_p.split(',')[1], { base64: true });
      zip.file(i.props.image.name, maskedImage.split(',')[1], { base64: true });

    })
    zip.generateAsync({ type: 'blob' })
      .then(blob => {
        saveAs(blob, 'images.zip');
      });
  };


  const applyMask = (image: CanvasImageSource, mask: CanvasImageSource, width = 250, height = 190) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx?.drawImage(image, 0, 0, width, height);
    const cardImageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
    const carddata = cardImageData?.data;
    ctx?.drawImage(mask, 0, 0, width, height);
    const maskImageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
    const maskdata = maskImageData?.data;
    //在每一个像素上，如果maskdata为黑色，则将carddata的像素设置为透明的白色，若为白色，则保持不变
    for (let i = 0; i < carddata!.length; i += 4) {
      if (maskdata![i] == 0) {
        carddata![i + 3] = 0;
      }
    }
    ctx?.putImageData(cardImageData, 0, 0);
    return canvas.toDataURL();
  }




  return (
    <div>
      {
        <Dialog as="div" className="relative z-10" onClose={() => setDialogOpen(false)} open={isDialogOpen} >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h2" className="text-base font-semibold leading-6 text-gray-900">
                      {
                        imageCards.length == 0 ? "No images to export." :(
                        imageCards.filter((i: any) => !i.props.image.croped || i.props.image.type == CardType.Unknown).length == 0 ?
                          "Export Complete." :
                          "Export partially complete, the following images are not cropped or recognized."
                        )
                      }
                    </Dialog.Title>
                    <div className="mt-2">
                      {imageCards.map((i: any) => {
                        if (!i.props.image.croped || i.props.image.type == CardType.Unknown) {
                          return <li key={i.props.image.name}>{i.props.image.name}</li>
                        }
                      })
                      }
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 sm:ml-3 sm:w-auto"
                    onClick={() => { setDialogOpen(false) }}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      }
      <div className="min-h-screen p-6 sm:p-10 bg-white shadow rounded-lg">
        <header className="flex items-center justify-between pb-6 border-b border-gray-200 mb-4">
          <h1 className="text-2xl font-semibold">STS Card Illustration Gen</h1>
        </header>
        <main className="grid gap-8">
          <section>
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold">Upload Images</h2>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* <Label htmlFor="images">Select Images</Label>  */}

                <Input id="images" multiple type="file" accept="image/*" onChange={handleImageChange}
                  className='border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 hover:border-indigo-500 block w-full'
                />


              </CardContent>
            </Card>
          </section>
          <section>
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold">Processed Images</h2>
                  <WorkflowIcon className="ml-2 h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {
                  imageCards
                }

              </CardContent>
            </Card>
          </section>
          <section>
            <Button variant="outline" onClick={exportImages}>
              Export Images
              <DownloadIcon className="ml-2 h-4 w-4" />
            </Button>
          </section>
        </main>
      </div>
    </div>
  )
}


function WorkflowIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="8" x="3" y="3" rx="2" />
      <path d="M7 11v4a2 2 0 0 0 2 2h4" />
      <rect width="8" height="8" x="13" y="13" rx="2" />
    </svg>
  )
}


function DownloadIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}
