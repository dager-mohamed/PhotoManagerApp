"use client";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SharedImage() {
  const { id } = useParams();
  const [valid, setValid] = useState(true)
  function NotValidLink() {
    setValid(false)
  }

  useEffect(() => {
    async function fetchData() {
      if (!id) return NotValidLink();
      try {
        let oldDocs = await getDocs(
          query(collection(db, "images"), where("shareId", "==", id))
        );
        if (oldDocs.docs.length == 0) return NotValidLink();

        let oldDoc: any = null;
        oldDocs.docs.map((d) => {
          oldDoc = d;
        });
        const oldDocData = oldDoc.data();
        try {
          await updateDoc(doc(db as any, "images", oldDoc.id), {
            views: oldDocData?.views + 1,
          });
          window.location.href = oldDocData?.imageUrl;
        } catch (err) {
          console.error(err);
          return NotValidLink();
        }
      } catch (err) {
        console.error(err);
        return NotValidLink();
      }
    }
    fetchData();
  }, []);
  return (
    <>
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="text-primary" />
          {
            valid ? <p className="text-muted-foreground">Redirecting...</p> : <p className="text-muted-foreground">The link is not valid</p>
          }
        </div>
      </div>
    </>
  );
}
