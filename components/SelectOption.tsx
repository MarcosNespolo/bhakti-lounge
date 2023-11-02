
"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { OPTIONS } from "@/app/lib/constants"
import { timeout } from "@/app/lib/expressions"

export default function SelectOption() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<typeof OPTIONS>(OPTIONS)
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
        await timeout(4000)
        setIsLoading(false)
        setOptionSelected(undefined)
      })
  }

  return (
    <div className="p-6 h-fit w-full rounded-lg bg-white shadow-md max-w-sm">
      <img
        className='w-40 mx-auto my-6'
        src={'/bhakti-logo.jpg'}
      />
      <div className='flex flex-col gap-4 mt-6 w-full' >
        <p className="text-gray-800 font-medium text-center">
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
                    text-gray-600 font-medium text-sm 
                    cursor-pointer
                    hover:text-primary
                    ${optionSelected == option.id &&
                ' bg-primary text-white font-semibold hover:text-white'
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
            className="flex flex-col gap-2 p-4 justify-center items-center w-full rounded-md bg-green-50 text-green-800 text-left font-semibold"
          >
            <div className="flex flex-row gap-2 items-center text-green-800 opacity-90 text-sm">
              <CheckCircleIcon
                className="w-12 h-12 opacity-80"
              />
              <p className="">
                Thank you for taking the time to complete this survey.
              </p>
            </div>
            <p className="text-xs">
              Your feedback is valuable to us and will help us improve our services.
            </p>
          </div>
          : <></>
        }
      </div>
    </div>
  )
}