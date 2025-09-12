import Link from 'next/link'
 
export default function NotFound() {
  return (
        <div className="w-full flex justify-center relative mt-40">
              <img src="/images/404notfound.PNG" alt="no posts added yet!" className="scale-90"/>  
              <h3 className="text-center text-xl/tight font-extrabold text-neutral-600 bg-neutral-50 h-fit p-2 absolute top-55">Page Not <br/>Found!</h3>
        </div>
  )
}