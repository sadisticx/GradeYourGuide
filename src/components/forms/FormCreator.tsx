import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Copy, Link } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Form schema validation
const formSchema = z.object({
  title: z.string().optional(),
  questionnaire: z.string({
    required_error: "Please select a questionnaire",
  }),
  section: z.string({
    required_error: "Please select a class section",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  additionalInstructions: z.string().optional(),
  isActive: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface FormCreatorProps {
  onSubmit?: (data: FormValues) => void;
  questionnaires?: { id: string; title: string }[];
  sections?: { id: string; name: string }[];
  initialData?: any;
}

const FormCreator = ({
  onSubmit,
  initialData,
  questionnaires = [
    { id: "1", title: "Teaching Effectiveness Evaluation" },
    { id: "2", title: "Course Content Evaluation" },
    { id: "3", title: "Faculty Engagement Assessment" },
  ],
  sections = [
    { id: "101", name: "CS101-A: Introduction to Programming" },
    { id: "102", name: "CS201-B: Data Structures" },
    { id: "103", name: "CS301-C: Algorithms" },
    { id: "104", name: "CS401-D: Software Engineering" },
  ],
}: FormCreatorProps) => {
  const [generatedLink, setGeneratedLink] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          questionnaire:
            initialData.questionnaire || questionnaires[0]?.id || "1",
          section: initialData.section || sections[0]?.id || "101",
          startDate: initialData.createdAt || new Date(),
          endDate:
            initialData.expiresAt ||
            new Date(new Date().setDate(new Date().getDate() + 14)),
          additionalInstructions: initialData.additionalInstructions || "",
          isActive: initialData.status === "active",
          title: initialData.title || "",
        }
      : {
          questionnaire: questionnaires[0]?.id || "1",
          section: sections[0]?.id || "101",
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 14)), // Default to 2 weeks from now
          additionalInstructions: "",
          isActive: false,
          title: "",
        },
  });

  const handleSubmit = (values: FormValues) => {
    // Generate a unique link for the form
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const link = `https://faculty-eval.example.com/form/${uniqueId}`;
    setGeneratedLink(link);

    // Call the onSubmit prop if provided
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    // In a real app, you would show a toast notification here
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>Create Evaluation Form</CardTitle>
        <CardDescription>
          Configure a new evaluation form and distribute it to students.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Form Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a title for this evaluation form"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive title for this evaluation form
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="questionnaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Questionnaire Template</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a questionnaire template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {questionnaires.map((questionnaire) => (
                          <SelectItem
                            key={questionnaire.id}
                            value={questionnaire.id}
                          >
                            {questionnaire.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the evaluation questionnaire to use for this form.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Section</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the class section for this evaluation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                              !field.value && "text-muted-foreground",
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When students can start submitting evaluations.
                    </FormDescription>
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
                              !field.value && "text-muted-foreground",
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When the evaluation form will close.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional instructions for students..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional instructions that will be displayed to students
                    before they complete the evaluation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Activate Form</FormLabel>
                    <FormDescription>
                      When activated, students will be able to access and submit
                      the evaluation form.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {generatedLink && (
              <div className="flex flex-col space-y-2 p-4 border rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Evaluation Form Link</p>
                <div className="flex items-center space-x-2">
                  <Input value={generatedLink} readOnly className="flex-1" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this link with students to collect their evaluations.
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto">
                {generatedLink ? "Update Form" : "Generate Form Link"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormCreator;
