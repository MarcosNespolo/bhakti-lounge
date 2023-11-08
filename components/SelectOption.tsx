
"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { OPTIONS } from "@/app/lib/constants"
import { timeout } from "@/app/lib/expressions"

export default function SelectOption() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<typeof OPTIONS>(OPTIONS.filter(option => option.enabled))
  const [optionSelected, setOptionSelected] = useState<number>()

  const supabase = createClientComponentClient()

  async function selectOption(id: number) {
    setOptionSelected(id)
    setIsLoading(true)

    await supabase
      .from('form')
      .insert({
        question: 0,
        response: id
      })
      .then(async (result) => {
        console.log(result)
        await timeout(5000)
        setIsLoading(false)
        setOptionSelected(undefined)
      })
  }

  return (
    <div className="p-6 h-fit w-full rounded-lg bg-white shadow-md max-w-xl">
      <img
        className='w-40 mx-auto my-6'
        src={'/bhakti-logo.jpg'}
      />
      <div className='grid grid-cols-2 gap-4 mt-6 w-full' >
        <p className="col-span-2 text-gray-800 font-medium text-center text-lg mb-2">
          How did you first hear about Bhakti Lounge?
        </p>
        {options.map(option => (
          !optionSelected || optionSelected == option.id
            ?
            <div
              className={`
                w-full 
                border border-gray-200 
                p-4 
                rounded-lg 
                shadow 
                text-gray-600 font-medium text-base 
                cursor-pointer
                ${optionSelected == option.id &&
                ' col-span-2 bg-primary text-xl text-white font-semibold text-center'
                }
              `}
              onClick={() => !isLoading && selectOption(option.id)}
            >
              {option.name}
            </div>
            : <></>

        ))}
        {isLoading
          ?
          <div
            className="col-span-2 flex flex-row gap-4 p-4 items-center justify-center w-full rounded-md bg-green-50 text-green-800 text-left font-semibold"
          >
            <CheckCircleIcon
              className="w-12 h-12 opacity-80"
            />
            <div className="flex flex-col gap-2 text-green-800 opacity-90 text-base">
              <p>
                Thank you for taking the time to complete this survey.
              </p>
              <p className="text-sm">
                Your feedback is valuable to us and will help us improve our services.
              </p>
            </div>
          </div>
          : <></>
        }
      </div>
    </div>
  )
}