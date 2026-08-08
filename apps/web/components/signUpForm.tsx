"use client"
import React, { useState } from "react"
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
import { Field, FieldGroup } from "./ui/field"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@/components/ui/label"
import { Input } from "./ui/input"
import { Spinner } from "./ui/spinner"
import { authClient } from "@/lib/authClient"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
interface signUpProps {
  openSignUp : boolean ,
  setOpenSignUp : React.Dispatch<React.SetStateAction<boolean>> 
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>> 
}
const signUpSchema = z.object({
  name : z.string().min(3).max(30) ,
  email : z.string().email(),
  password : z.string().min(6)
})

export function SignUp ({
  openSignUp ,
  setOpenSignUp ,
  setFormOpen
} : signUpProps){
  const {
  register ,
  handleSubmit ,
  formState :{errors}
} = useForm({
  resolver : zodResolver(signUpSchema)
})
const [loading , setLoading ] = useState<boolean>(false )
  const router  = useRouter() 
  const submit =async (data : z.infer<typeof signUpSchema>)=>{
    try{  
      setLoading(true);
      const res = await authClient.signUp.email({
        name : data.name ,
        email : data.email ,
        password : data.password
      })
      console.log("the res is " , res)
      if(res.data?.user){
        router.push("/dashboard")
      }
       if(!res.data){
            toast.success(data.name + "welcome")
        }
    }catch(e){
        console.log(e)
    }finally{
      setLoading(false)
      setOpenSignUp(t => !t)
      setFormOpen(t => !t)
    }
  }

  return <Dialog open={openSignUp} onOpenChange={setOpenSignUp}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleSubmit(submit)}>
             <DialogHeader>
            <DialogTitle className="text-3xl">SignUp</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">name</Label>
              <Input {...register("name")} id="name" name="name" defaultValue="name" />
              {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            </Field>
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input {...register("email")} id="email" name="email" defaultValue="name@gmail.com" />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            </Field>
            <Field>
              <Label htmlFor="password">Password</Label>
              <Input {...register("password")} id="password" type="password" name="password" />
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{
                loading ?  <Spinner className="size-4" /> : "SignUp"
              }</Button>
          </DialogFooter>

          <div className="flex gap-2">
          Do not have an account ?<div className="hover:bg-slate-600 rounded-3xl px-3"
            onClick={() => setOpenSignUp(t => !t)}
          >
            signin
          </div>
          </div>
          </form>
        </DialogContent>
    </Dialog>
}