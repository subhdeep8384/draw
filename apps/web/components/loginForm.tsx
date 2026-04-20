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
import { useState } from "react"
import { toast } from "sonner"
import { authClient } from "@/lib/authClient"
import { SignUp } from "./signUpForm"


interface LoginFormProps {
    formOpen : boolean
    setFormOpen : React.Dispatch<React.SetStateAction<boolean>> 
}
export function LoginForm({
    formOpen , setFormOpen
}  : LoginFormProps) {
  const formLoginSchema = z.object({
    email : z.string().email(),
    password : z.string().min(6)
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formLoginSchema),
  })
  const [loading , setLoading ] = useState(false);
  const router = useRouter()
  const submit = async ( data : z.infer<typeof formLoginSchema> )=>{
    try{
      setLoading(true)
      const res =  await authClient.signIn.email({
        email : data.email,
        password : data.password 
      })
      if(res.data?.user){
        router.push("/dashboard")
      }
      if(!res.data){
        toast.error("Invalid email or password")
      }
    }catch(e){
      console.log(e)
    }finally{
      setLoading(false)
    }
  }
  
  const [openSignUp , setOpenSignUp ]= useState<boolean>(false)
  return (
    <Dialog open={formOpen} onOpenChange={setFormOpen}>
      <SignUp openSignUp={openSignUp} setOpenSignUp={setOpenSignUp} setFormOpen={setFormOpen}/>
        <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(submit)} >
          <DialogHeader>
            <DialogTitle className="text-3xl">Login</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
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
                loading ?  <Spinner className="size-4" /> : "Login"
              }</Button>
          </DialogFooter>

          <div className="flex gap-2">
          Do not have an account ?<div className="hover:bg-slate-600 rounded-3xl px-3"
            onClick={() => setOpenSignUp(t => !t)}
          >
            signup
          </div>
          </div>
        </form>
        </DialogContent>
    </Dialog>
  )
}
