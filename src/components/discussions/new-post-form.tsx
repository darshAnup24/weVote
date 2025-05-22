"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createForumPost } from "@/actions/forum-actions";
import { useState } from "react";
import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  content: z.string()
    .min(10, { message: "Post must be at least 10 characters long." })
    .max(1000, { message: "Post must be at most 1000 characters long." }),
});

export function NewPostForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await createForumPost(values.content);
      if (result.success) {
        toast({ 
          title: "Post Submitted!", 
          description: result.isFlagged ? `Your post is under review: ${result.reason}` : "Your anonymous post is now live.",
          variant: result.isFlagged ? "default" : "default", // 'default' for normal, can use custom for flagged
          className: result.isFlagged ? "bg-muted border-muted-foreground/50" : "bg-accent text-accent-foreground border-accent-foreground/20",
        });
        form.reset();
      } else {
        toast({ title: "Error Submitting Post", description: result.error || "Failed to submit post. Please try again.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred while submitting your post.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Share Your Thoughts Anonymously</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="postContent">Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      id="postContent"
                      placeholder="Type your anonymous message here... Keep it respectful and constructive."
                      className="min-h-[120px] resize-none"
                      {...field}
                      aria-describedby="content-message"
                    />
                  </FormControl>
                  <FormMessage id="content-message" />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Post Anonymously"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
