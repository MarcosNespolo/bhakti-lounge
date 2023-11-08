
"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import React, { useEffect, useState } from "react"
import { getLastMonthDate, getTodayDate } from "@/app/lib/expressions"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from "react-chartjs-2"
import { OPTIONS } from "@/app/lib/constants"
import type { ChartOptions } from 'chart.js'
import DatePicker from "./DatePicker"

ChartJS.register(ArcElement, Tooltip, Legend)

export type AnswerType = {
  labels: (string | undefined)[]
  datasets: {
    data: unknown[]
    backgroundColor: string[]
  }[]
}

export default function StatsComponent() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [dateFilter, setDateFilter] = useState<string[]>([getLastMonthDate(), getTodayDate()])
  const [error, setError] = useState<string | null>('')
  const [answers, setAnswers] = useState<AnswerType>()
  const pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        align: 'center',
        labels: {
          font: {
            size: 14,
            weight: '600'
          }
        }
      },
    }
  }

  const supabase = createClientComponentClient()

  useEffect(() => {
    getAnswers()
  }, [dateFilter])

  async function getAnswers() {
    setIsLoading(true)

    let query = supabase
      .from('form')
      .select(' * ')
      .order('created_at')

    if (dateFilter[0] != '') {
      query.gt('created_at', dateFilter[0])
    }
    if (dateFilter[1] != '') {
      query.lt('created_at', dateFilter[1])
    }

    const { data, error: bookingsError } = await query

    if (data) {
      setIsLoading(false)
      const groupedData: { [key: string]: number } = data.reduce((acc, item) => {
        const response = item.response
        acc[response] = (acc[response] || 0) + 1
        return acc;
      }, {})

      const values = Object.values(groupedData).map(value => value || 0)
      const labels = Object.keys(groupedData).map(label => {
        const option = OPTIONS.find(option => option.id == +label)
        const name = option?.name || 'Unknown'
        const value = groupedData[+label] || 0
        return `${value} - ${name}`
      })

      const chartData = {
        labels: labels && labels.length > 0 ? labels : [],
        datasets: [
          {
            data: values,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1
          }
        ]
      }
      setAnswers(chartData)
    }
    if (bookingsError) {
      setIsLoading(false)
      setError(bookingsError.message)
    }
  }

  return (
    <div className="p-6 h-fit w-full rounded-lg bg-white shadow-md max-w-xl">
      <img
        className='w-40 mx-auto my-6'
        src={'/bhakti-logo.jpg'}
      />
      <div>
        <p className='text-sm font-semibold'>Dates</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <DatePicker
            id="pickup-start"
            selectedDate={dateFilter[0]}
            onChange={newDate => setDateFilter(pickupDate => [newDate, pickupDate[1]])}
            showPastDates
          />
          <DatePicker
            id="pickup-end"
            selectedDate={dateFilter[1]}
            onChange={newDate => setDateFilter(pickupDate => [pickupDate[0], newDate])}
            showPastDates
          />
        </div>
      </div>
      <div className='flex flex-col gap-4 mt-6 w-full' >
        {isLoading
          ? <></>
          : answers && answers.labels && answers.labels.length > 0
            ? <>
              <p className="col-span-2 text-gray-800 font-medium text-center text-lg mb-2">
                How did you first hear about Bhakti Lounge?
              </p>
              {answers && answers.labels
                ?
                <div className="h-fit">
                  <Pie
                    options={pieChartOptions}
                    data={answers}
                  />
                </div>
                : <></>
              }
            </>
            :
            <div className="w-full p-4 rounded-md bg-gray-100 text-gray-800 text-sm">
              <p className="font-semibold">
                No data for the selected date range
              </p>
            </div>
        }
      </div>
    </div>
  )
}