
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createElection, type CreateElectionInput } from "@/actions/election-actions";
import { useState } from "react";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(500),
  candidateNames: z.string().min(1, { message: "At least one candidate name is required." }),
  candidateDescriptions: z.string().optional(),
  voterEmails: z.string().optional(),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date.",
  path: ["endDate"],
});

type FormValues = z.infer<typeof formSchema>;

export function CreateElectionForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      candidateNames: "",
      candidateDescriptions: "",
      voterEmails: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    const electionInput: CreateElectionInput = {
      ...values,
      candidateNames: values.candidateNames,
      candidateDescriptions: values.candidateDescriptions || "",
      voterEmails: values.voterEmails || "",
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
    };

    try {
      const result = await createElection(electionInput);
      if (result.success) {
        toast({
          title: "Election Created!",
          description: `"${result.election?.title}" has been successfully created.`,
          className: "bg-accent text-accent-foreground border-accent-foreground/20",
        });
        form.reset();
        router.push('/voting'); // Redirect to voting page after creation
      } else {
        toast({ title: "Error Creating Election", description: result.error || "Failed to create election.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Election Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Annual Club Presidency" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Election Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Briefly describe the purpose of this election." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="candidateNames"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Candidate Names</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter each candidate name on a new line or separated by a comma." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>One name per line or comma-separated.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="candidateDescriptions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Candidate Descriptions (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter corresponding descriptions for each candidate on a new line. Ensure order matches candidate names." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>One description per line, matching the order of names. Leave blank if not needed now.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="voterEmails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allowed Voter Emails (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter email addresses, separated by commas or new lines." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>If empty, any authenticated user can vote (simulated). For restricted voting, list emails here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < (form.getValues("startDate") || new Date(new Date().setHours(0,0,0,0)))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-5 w-5" />
          {isSubmitting ? "Creating Election..." : "Create Election"}
        </Button>
      </form>
    </Form>
  );
}
