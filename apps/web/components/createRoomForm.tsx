import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { toast } from "sonner"

import axios from "axios"
import { classRegistry } from "fabric"


interface LoginFormProps {
    formOpen : boolean
    setFormOpen: Dispatch<SetStateAction<boolean>>;
    setRefresh: Dispatch<SetStateAction<boolean>>; 
}
export function CreateRoomForm({
    formOpen , setFormOpen , setRefresh
}  : LoginFormProps) {

  const newRoomCreateSchema = z.object({
    name : z.string().min(3).max(50) ,
    password : z.string().min(6).max(30).optional() 
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newRoomCreateSchema),
  })

  const [action , setAction ] = useState<"create" | "join">("create")
  const [loading , setLoading ] = useState(false);
  const router = useRouter()

  const submit = async (data :{
    name : string ,
    password? : string 

  }) =>{
      if(action === "create"){
        try{
          setLoading(true)
          const res = await axios.post("http://localhost:3005/api/room/create" , {
            name : data.name ,
            password : data.password
          }, {
            withCredentials : true
          })
          
          if(res.status === 200){
            toast.success("Room created successfully")
            setFormOpen(false)
            router.push("/dashboard")
            setRefresh( (e) => !e )
          }
        }catch(e){
          console.log(e)
        }finally{
          setLoading(false)
        }
      }

      if(action === "join"){
       const res = await axios.post("http://localhost:3005/api/room/join" ,{
        name : data.name ,
        password : data.password 
       },{
        withCredentials :true
       })
       if ((await res).status !== 200 ){
          return 
       }
       
       router.push(`/dashboard/draw/${res.data.roomId}`)
      }
    }
    
    return (
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(submit)} >
          <DialogHeader>
            <DialogTitle className="text-3xl">Create new Room</DialogTitle>
            <DialogDescription>
              This will create a new room 
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="email">Name</Label>
              <Input {...register("name")} id="name" name="name" placeholder="enter room name" />
              {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            </Field>
             <Field>
              <Label htmlFor="password">Password</Label>
              <Input {...register("password")} id="password" name="password" placeholder="enter room password" />
              {errors.password && <span className="text-red-500">{errors.password?.message}</span>}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={() => setAction("create")}
              type="submit">{
                loading ?  <Spinner className="size-4" /> : "Create"
              }</Button>
              <Button 
                onClick={() => setAction("join")}
              type="submit">{
                loading ?  <Spinner className="size-4" /> : "Join"
              }</Button>
          </DialogFooter>
        </form>
        </DialogContent>
    </Dialog>
  )
}
