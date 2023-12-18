import "cropperjs/dist/cropper.css";
import React, { createRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Image from 'next/image';
import Cropper, { ReactCropperElement } from "react-cropper";
import { Dialog } from '@headlessui/react'


interface ImageCardProps {
    image: {
        url: string;
        name: string;
        croped?: boolean,
        cropImage?: string;
    };
    index: number;
}

function ImageCard({ image, index }: ImageCardProps) {
    const cancelButtonRef = useRef(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const [previewData, setPreviewData] = useState(image.url);
    const cropperRef = createRef<ReactCropperElement>();

    useEffect(() => {
        setPreviewData(image.url);
        image.cropImage = image.url;
    }, [image.url]);


    const crop = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            image.croped = true;
            // image.cropImage = cropperRef.current?.cropper.getCroppedCanvas({width:250,height:190,imageSmoothingEnabled:true}).toDataURL();
            image.cropImage = cropperRef.current?.cropper.getCroppedCanvas({imageSmoothingEnabled:true,imageSmoothingQuality:'high'}).toDataURL();
            setPreviewData( image.cropImage);
        }
    }

    return (
        <div>
            <div key={index} className="relative group">
                <Image
                    alt="Processed image"
                    className="rounded-lg object-cover w-full aspect-[25/19] group-hover:opacity-50 transition-opacity"
                    height={190}
                    width={250}
                    src={previewData}
                    onClick={handleImageClick}
                />
                <div className="absolute bottom-0 left-0 p-2 text-white bg-black bg-opacity-50 w-full rounded-lg">
                    <h3 className="font-semibold">{image.name}</h3>
                </div>
            </div>

            {//裁剪框
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setIsModalOpen(false)} open={isModalOpen} >

                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                            Cropper Image
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <Cropper
                                                ref={cropperRef}
                                                zoomTo={0.1}
                                                dragMode="move"
                                                src={image.url}
                                                aspectRatio={25 / 19}
                                                viewMode={1}
                                                minCropBoxHeight={19}
                                                minCropBoxWidth={25}
                                                background={false}
                                                autoCropArea={1}
                                                guides={true}
                                                center={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 sm:ml-3 sm:w-auto"
                                        onClick={() => { crop(); setIsModalOpen(false) }}
                                    >
                                        确定
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setIsModalOpen(false)}
                                        ref={cancelButtonRef}
                                    >
                                        取消
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            }

        </div>
    );
}

export default ImageCard;