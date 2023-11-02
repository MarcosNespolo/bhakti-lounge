import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const supabase = createRouteHandlerClient({ cookies })
    const { question, response } = await request.json()

    const result = await supabase
        .from('form')
        .insert({ question, response })

    console.log(result)

    return NextResponse.json(result, { status: 200 })

}