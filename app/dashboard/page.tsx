"use client"

import Image from "next/image"
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import React, { useState } from 'react';


export default function Home() {


    const [selectedImages, setSelectedImages] = useState([]);

    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      const fileReaders = files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ name: file.name, url: reader.result });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
    
      Promise.all(fileReaders)
        .then(images => {
          setSelectedImages([...images]);
        })
        .catch(error => console.error(error));
    };


    return (
      <div className="min-h-screen p-6 sm:p-10 bg-white shadow rounded-lg">
        <header className="flex items-center justify-between pb-6 border-b border-gray-200 mb-4">
          <h1 className="text-2xl font-semibold">STS Card Illustration Gen</h1>
        </header>

        <main className="grid gap-8">
          <section>
              <Card>
                  <CardHeader>
                      <h2 className="text-xl font-semibold">Upload Images</h2>
                  </CardHeader>

                  <CardContent className="grid gap-4 ">
                      <Label htmlFor="images">Select Images</Label>
                          <Input id="images" multiple type="file" onChange={handleImageChange} />
                          <Button variant="outline">
                              Process Images
                              <WorkflowIcon className="ml-2 h-4 w-4" />
                          </Button>
                  </CardContent>
              </Card>
          </section>
          
          <section>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Processed Images</h2>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                
                {selectedImages.map((image, index) => (
                    <div key={index} className="relative group">
                            <Image
                              alt="Processed image"
                              className="rounded-lg object-cover w-full aspect-[1/1] group-hover:opacity-50 transition-opacity"
                              height={200}
                              src={image.url}
                              width={200}
                            />
                        <div className="absolute bottom-0 left-0 p-2 text-white bg-black bg-opacity-50 w-full rounded-lg">
                            <h3 className="font-semibold">{image.name}</h3>
                        </div>
                    </div>
                ))}

              </CardContent>
            </Card>
          </section>
          <section>
            <Button variant="outline">
              Export Images
              <DownloadIcon className="ml-2 h-4 w-4" />
            </Button>
          </section>
        </main>
      </div>
    )
  }
  
  
  function WorkflowIcon(props) {
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
  
  
  function DownloadIcon(props) {
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
  