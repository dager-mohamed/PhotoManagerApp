"use client";

import { PlusIcon, ShareIcon, Copy, CloudUploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { storage, db } from "@/lib/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  where,
  query,
  getDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { Badge } from "@/components/ui/badge";

interface Image {
  authorEmail: string;
  views: number;
  imageUrl: string;
  shareId: string;
}

export default function Dashboard() {
  const session = useSession();
  const [imageFile, setImageFile] = useState<FileList | null>(null);
  const [uploadingFinished, setUploadingFinished] = useState<boolean>(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [images, setImages] = useState<Image[]>([]);
  const { toast } = useToast();
  const allowedExt = ["image/png", "image/jpg", "image/jpeg"];

  useEffect(() => {
    if (uploadDialogOpen == false && imageFile != null) setImageFile(null);
  }, [uploadDialogOpen]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const querySnapshot = await getDocs(
        query(
          collection(db, "images"),
          where("authorEmail", "==", session.data?.user?.email)
        )
      );
      const imagesArr = querySnapshot.docs.map((docData) => {
        return docData.data() as Image;
      });
      setImages(imagesArr);
      setLoading(false);
    }
    fetchData();
  }, []);

  function uploadImage() {
    console.log(imageFile);
    if (imageFile == null || !allowedExt.includes(imageFile[0].type))
      return toast({
        title: "Please upload a file first",
        variant: "destructive",
      });

    setUploadingFinished(false);
    const imageRef = ref(storage, `images/${uuid()}`);
    uploadBytes(imageRef, imageFile[0])
      .then((snapshot) => {
        getDownloadURL(imageRef)
          .then((imageUrl) => {
            const docData = {
              authorEmail: session.data?.user?.email,
              views: 0,
              imageUrl: String(imageUrl),
              shareId: uuid(),
            };
            setDoc(doc(db as any, "images", uuid()), docData)
              .then(() => {
                setUploadingFinished(true);
                setImages([...(images as any), docData as any]);
                setUploadDialogOpen(false);
                toast({
                  title: "Image uploaded successfully",
                });
              })
              .catch((err) => {
                toast({
                  title: "An error occured",
                  description: err.message,
                  variant: "destructive",
                });
                setUploadingFinished(true);
              });
          })
          .catch((err) => {
            toast({
              title: "An error occured",
              description: err.message,
              variant: "destructive",
            });
            setUploadingFinished(true);
          });
      })
      .catch((err) => {
        toast({
          title: "An error occured",
          description: err.message,
          variant: "destructive",
        });
        setUploadingFinished(true);
      });
  }
  return loading ? (
    <>
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className= "text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    </>
  ) : (
    <>
      <Toaster />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex flex-row items-center justify-between gap-2">
              <PlusIcon className="h-5 w-5" /> Upload Image
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload an Image</DialogTitle>
              <DialogDescription>
                Drag and drop a file or click the button to select a file to
                upload.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                {imageFile != null && imageFile[0].name ? (
                  <Badge variant={"outline"}>{imageFile[0].name}</Badge>
                ) : (
                  <>
                    <Label htmlFor="file-upload">Select a File</Label>
                    <div className="group relative flex h-32 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-primary transition-colors hover:border-primary">
                      <input
                        id="file-upload"
                        onChange={(e) => setImageFile(e.target.files)}
                        type="file"
                        accept=".png,.jpg"
                        className="absolute inset-0 h-full w-full opacity-0"
                      />
                      <div className=" flex flex-col items-center justify-center space-y-2 text-primary">
                        <CloudUploadIcon className="h-8 w-8" />
                        <p className="text-sm font-medium">
                          Drag and drop a file or click to upload
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {uploadingFinished ? (
                <Button
                  disabled={
                    imageFile != null && allowedExt.includes(imageFile[0].type)
                      ? false
                      : true
                  }
                  type="submit"
                  onClick={uploadImage}
                >
                  Upload
                </Button>
              ) : (
                <Button disabled>Uploading...</Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Separator />

      <div className="flex justify-start flex-wrap gap-5">
        {images.map((image) => (
          <Card className="w-full max-w-md">
            <div className="relative">
              <img
                src={image.imageUrl}
                width={600}
                height={400}
                alt="Card Image"
                className="aspect-[3/2] w-full rounded-t-md object-cover"
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 rounded-full bg-background/80 p-2 text-muted-foreground hover:bg-background"
                  >
                    <ShareIcon className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                      Anyone who has this link will be able to view this.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="link" className="sr-only">
                        Link
                      </Label>
                      <Input
                        id="link"
                        defaultValue={`${window.origin}/images/${image.shareId}`}
                        readOnly
                      />
                    </div>
                    <Button onClick={() => window.navigator.clipboard.writeText(`${window.origin}/images/${image.shareId}`)} size="sm" className="px-3">
                      <span className="sr-only">Copy</span>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
        {images.length == 0 && (
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no images uploaded
            </h3>
          </div>
        )}
      </div>
    </>
  );
}
