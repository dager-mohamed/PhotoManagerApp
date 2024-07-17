"use client"

import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";

interface ImageAnalyticsData {
    photoLink: string;
    clicks: number;
}

export default function Analytics() {
    const session = useSession()
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<ImageAnalyticsData[]>([])
  useEffect(() => {
    setLoading(true)
    async function fetchData() {
      setLoading(true);
      const arraysData: ImageAnalyticsData[] = []
      const querySnapshot = await getDocs(
        query(
          collection(db, "images"),
          where("authorEmail", "==", session.data?.user?.email)
        )
      );
       querySnapshot.docs.map((docData) => {
        arraysData.push({
            photoLink: docData.data().imageUrl,
            clicks: docData.data().views
        })
      });
      setAnalyticsData(arraysData)
      setLoading(false);
    }
    fetchData();
  }, []);
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
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Analytics</h1>
        <div></div>
      </div>
      <Separator />
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-muted">
                <th className="py-3 px-4 text-left font-medium">Picture</th>
                <th className="py-3 px-4 text-right font-medium">
                  Total Clicks
                </th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((val, index) => (
                <tr
                  key={index}
                  className="border-b border-muted/40 hover:bg-muted/20"
                >
                  <td className="py-4 px-4">
                    <img
                      src={val.photoLink}
                      alt="Photo Thumbnail"
                      width={64}
                      height={64}
                      className="aspect-square rounded-md object-cover"
                    />
                  </td>
                  <td className="py-4 px-4 text-right">{val.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
