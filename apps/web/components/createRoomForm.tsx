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
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newRoomCreateSchema),
  })
  const [loading , setLoading ] = useState(false);
  const router = useRouter()
  const submit = async (data :{
    name : string 
  }) =>{
    try{
      setLoading(true)
      console.log(data)
      const res = await axios.post("http://localhost:3005/api/room/create" , {
        name : data.name
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
              <Input {...register("name")} id="name" name="name" defaultValue="name@gmail.com" />
              {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{
                loading ?  <Spinner className="size-4" /> : "Create"
              }</Button>
          </DialogFooter>
        </form>
        </DialogContent>
    </Dialog>
  )
}
