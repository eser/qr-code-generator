"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateQRCode } from "../actions"

const formSchema = z.object({
  contentType: z.enum(["text", "url", "email", "phone"]),
  content: z.string().min(1, "Content is required"),
})

export default function QRCodeGenerator() {
  const [qrCode, setQRCode] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentType: "text",
      content: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const qrCodeData = await generateQRCode(values.content)
      setQRCode(qrCodeData)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="contentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Input placeholder="Enter content" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Generate QR Code</Button>
        </form>
      </Form>

      {qrCode && (
        <div className="mt-8 space-y-4">
          <img src={qrCode || "/placeholder.svg"} alt="Generated QR Code" className="mx-auto" />
          <Button asChild className="w-full">
            <a href={qrCode} download="qr-code.png">
              Download QR Code
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}

