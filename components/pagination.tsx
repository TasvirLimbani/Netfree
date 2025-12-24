"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  pathname: string
}

export function Pagination({ currentPage, totalPages, pathname }: PaginationProps) {
  const getPageUrl = (page: number) => {
    return `${pathname}?page=${page}`
  }

  const pages = []
  const maxPagesToShow = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  if (startPage > 1) {
    pages.push(
      <Link
        key="first"
        href={getPageUrl(1)}
        className="px-3 py-2 rounded-lg bg-card hover:bg-primary/20 text-white transition-colors"
      >
        1
      </Link>,
    )
    if (startPage > 2) {
      pages.push(
        <span key="ellipsis-start" className="px-3 py-2 text-gray-500">
          ...
        </span>,
      )
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <Link
        key={i}
        href={getPageUrl(i)}
        className={`px-3 py-2 rounded-lg transition-colors ${
          i === currentPage ? "bg-primary text-white" : "bg-card hover:bg-primary/20 text-white"
        }`}
      >
        {i}
      </Link>,
    )
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="ellipsis-end" className="px-3 py-2 text-gray-500">
          ...
        </span>,
      )
    }
    pages.push(
      <Link
        key="last"
        href={getPageUrl(totalPages)}
        className="px-3 py-2 rounded-lg bg-card hover:bg-primary/20 text-white transition-colors"
      >
        {totalPages}
      </Link>,
    )
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="p-2 rounded-lg bg-card hover:bg-primary/20 text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      )}

      <div className="flex items-center gap-1">{pages}</div>

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="p-2 rounded-lg bg-card hover:bg-primary/20 text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      )}
    </div>
  )
}
