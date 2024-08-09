import AddDocBtn from "@/components/AddDocBtn";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { fetchDoc } from "@/lib/actions/room.action";
import { dateConverter } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function Home() {
  const clerkuser = await currentUser()

  if(!clerkuser) redirect('/sign-in')
  const document = await fetchDoc(clerkuser.emailAddresses[0].emailAddress)
  return (
    <main className="home-container">
      <Header className=" sticky left-0 top-0">
        <div className=" flex items-center gap-2 lg:gap-4">
          Notifications
          <UserButton/>
        </div>
      </Header>

      {document.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All documnets</h3>
            <AddDocBtn userId={clerkuser.id} email={clerkuser.emailAddresses[0].emailAddress}/>
          </div>
          <ul className="document-ul">
            {document.data.map((each:any)=>(
              <li key={each.id} className="document-list-item">
                <Link href={`/documents/${each.id}`} className=" flex flex-1 items-center gap-4">
                  <div className=" hidden rounded-md bg-dark-500 sm:block p-2">
                    <Image src={'/assets/icons/doc.svg'} alt="doc icon" height={40} width={40}/>
                  </div>
                  <div className="space-y-1">
                    <p className=" line-clamp-1 text-lg">{each.metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">Created at {dateConverter(each.createdAt)}</p>
                  </div>
                </Link>
                {/* add delete button */}
              </li>
            ))}
          </ul>
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
