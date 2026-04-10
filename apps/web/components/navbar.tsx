"use client"
import React, {  useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import { LoginForm } from './loginForm'
import { authClient } from '@/lib/authClient'
import { useRouter } from 'next/navigation'
import { Switch } from "@/components/ui/switch"
import { useTheme } from 'next-themes'


const NavBar = () => {
    const { setTheme} = useTheme()
    const router = useRouter()
    const [session, setSession] = useState<{
        "email" : string,
        "id" : string,
        "name" : string
    }>({
        email : "",
        id : "",
        name : ""
    })
    const [formOpen , setFormOpen ] = useState(false )
    useEffect(() =>{
        const fetchSession = async () => {
            const res = await authClient.getSession()
            setSession({
                email : res.data?.user.email || "" ,
                id : res.data?.user.id || "", 
                name : res.data?.user.name || "" 
            })
          }
          fetchSession()
    } , [] )
    return (

        <header>
            <nav className='absolute top-0 left-0 right-0 z-10 p-1 font-bold text-2xl'>
               <LoginForm formOpen={formOpen} setFormOpen={setFormOpen} />
                <div className='flex justify-between p-7 font-bold text-2xl sm:hidden'>
                    <div>logo</div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Open</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40" align="start">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                                        Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className={`${!session?.email ? "" : "hidden"}`}
                                        onClick={() => setFormOpen(t => !t)}
                                    >
                                        login
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className='hidden sm:bg-transparent sm:p-5 sm:flex justify-between'>
                    <div>logo</div>
                    <div>
                        <ul className='flex gap-12'>
                            <li
                                className='cursor-pointer'
                            >Home</li>
                            <li 
                            className={`${!session?.email ? "" : "hidden"} cursor-pointer`}
                            onClick={() => setFormOpen(t => !t)}>login</li>
                            <li 
                            className='cursor-pointer'
                                onClick={() => router.push("/dashboard")}
                            >dashboard</li>
                            <li>
                            <Switch onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} />
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>

    )
}

export default NavBar
