import AddDocBtn from "@/components/AddDocBtn";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";


export default async function Home() {
  const clerkuser = await currentUser()

  if(!clerkuser) redirect('/sign-in')
  const document = []
  return (
    <main className="home-container">
      <Header className=" sticky left-0 top-0">
        <div className=" flex items-center gap-2 lg:gap-4">
          Notifications
          <UserButton/>
        </div>
      </Header>

      {document.length > 0 ? (
        <div>

        </div>
      ):
      
      (
        <div className=" document-list-empty">
          <Image src={'/assets/icons/doc.svg'} alt="document" width={40} height={40} className=" mx-auto"/>

          <AddDocBtn userId={clerkuser.id} email={clerkuser.emailAddresses[0].emailAddress}/>
        </div>
      )}
    </main>
  );
}
