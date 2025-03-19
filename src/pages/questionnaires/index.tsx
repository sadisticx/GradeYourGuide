import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import QuestionnaireList from "@/components/questionnaires/QuestionnaireList";
import QuestionnaireBuilder from "@/components/questionnaires/QuestionnaireBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const QuestionnairesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<
    string | null
  >(null);

  // State for questionnaires data
  const [questionnaires, setQuestionnaires] = useState([
    {
      id: "1",
      title: "End of Semester Evaluation",
      description: "Standard evaluation form for end of semester feedback",
      sections: [
        {
          id: "s1",
          title: "Teaching Quality",
          questions: [
            {
              id: "q1",
              text: "How would you rate the overall teaching quality?",
              type: "rating",
            },
            {
              id: "q2",
              text: "What aspects of teaching could be improved?",
              type: "qualitative",
            },
          ],
        },
        {
          id: "s2",
          title: "Course Content",
          questions: [
            {
              id: "q3",
              text: "Was the course content relevant to your learning goals?",
              type: "rating",
            },
            {
              id: "q4",
              text: "What topics would you like to see added or removed?",
              type: "qualitative",
            },
          ],
        },
      ],
      status: "active",
      createdAt: new Date(2023, 5, 15),
      updatedAt: new Date(2023, 6, 1),
    },
    {
      id: "2",
      title: "Mid-Term Feedback Form",
      description: "Quick feedback collection halfway through the semester",
      sections: [
        {
          id: "s1",
          title: "Course Progress",
          questions: [
            {
              id: "q1",
              text: "How would you rate your understanding of the material so far?",
              type: "rating",
            },
            {
              id: "q2",
              text: "What areas do you need more clarification on?",
              type: "qualitative",
            },
          ],
        },
      ],
      status: "draft",
      createdAt: new Date(2023, 7, 10),
      updatedAt: new Date(2023, 7, 10),
    },
    {
      id: "3",
      title: "Teaching Assistant Evaluation",
      description: "Form for evaluating teaching assistants",
      sections: [
        {
          id: "s1",
          title: "TA Performance",
          questions: [
            {
              id: "q1",
              text: "How helpful was the TA during lab sessions?",
              type: "rating",
            },
            {
              id: "q2",
              text: "How clear were the TA's explanations?",
              type: "rating",
            },
          ],
        },
      ],
      status: "archived",
      createdAt: new Date(2023, 2, 5),
      updatedAt: new Date(2023, 5, 20),
    },
  ]);

  // Filtered questionnaires based on search and status
  const filteredQuestionnaires = useMemo(() => {
    return questionnaires.filter((q) => {
      // Filter by status
      if (statusFilter !== "all" && q.status !== statusFilter) return false;

      // Filter by search query
      if (
        searchQuery &&
        !q.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !q.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [questionnaires, statusFilter, searchQuery]);

  // Handlers
  const handleCreateQuestionnaire = () => {
    setActiveTab("create");
  };

  const handleViewQuestionnaire = (id: string) => {
    setSelectedQuestionnaireId(id);
    setActiveTab("view");
  };

  const handleEditQuestionnaire = (id: string) => {
    setSelectedQuestionnaireId(id);
    setActiveTab("edit");
  };

  const handleDeleteQuestionnaire = (id: string) => {
    setQuestionnaires(questionnaires.filter((q) => q.id !== id));
  };

  const handleSaveQuestionnaire = (data: any) => {
    const now = new Date();

    if (selectedQuestionnaireId) {
      // Update existing questionnaire
      setQuestionnaires(
        questionnaires.map((q) => {
          if (q.id === selectedQuestionnaireId) {
            return {
              ...q,
              ...data,
              updatedAt: now,
            };
          }
          return q;
        }),
      );
    } else {
      // Create new questionnaire
      const newQuestionnaire = {
        id: Date.now().toString(),
        ...data,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      };
      setQuestionnaires([...questionnaires, newQuestionnaire]);
    }

    setActiveTab("list");
    setSelectedQuestionnaireId(null);
  };

  const handleBackToList = () => {
    setActiveTab("list");
    setSelectedQuestionnaireId(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Questionnaire Management</h1>
          {activeTab === "list" && (
            <Button onClick={handleCreateQuestionnaire}>
              <Plus className="mr-2 h-4 w-4" /> Create New Questionnaire
            </Button>
          )}
          {(activeTab === "create" ||
            activeTab === "edit" ||
            activeTab === "view") && (
            <Button variant="outline" onClick={handleBackToList}>
              Back to List
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="view">View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-lg shadow-sm">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questionnaires..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <QuestionnaireList
              questionnaires={filteredQuestionnaires}
              onView={handleViewQuestionnaire}
              onEdit={handleEditQuestionnaire}
              onDelete={handleDeleteQuestionnaire}
              onCreate={handleCreateQuestionnaire}
            />
          </TabsContent>

          <TabsContent value="create">
            <QuestionnaireBuilder onSave={handleSaveQuestionnaire} />
          </TabsContent>

          <TabsContent value="edit">
            <QuestionnaireBuilder
              initialData={{
                title: "Edit Existing Questionnaire",
                description:
                  "This is a placeholder for editing an existing questionnaire",
                sections: [
                  {
                    id: "1",
                    title: "Teaching Effectiveness",
                    description:
                      "Evaluate the instructor's teaching methods and effectiveness",
                    questions: [
                      {
                        id: "1-1",
                        text: "How would you rate the instructor's clarity in explaining course concepts?",
                        type: "rating",
                        required: true,
                      },
                      {
                        id: "1-2",
                        text: "What aspects of the teaching could be improved?",
                        type: "text",
                        required: true,
                      },
                    ],
                  },
                ],
              }}
              onSave={handleSaveQuestionnaire}
            />
          </TabsContent>

          <TabsContent value="view">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">View Questionnaire</h2>
              <p className="text-muted-foreground mb-6">
                This is a read-only view of the questionnaire. You can see all
                sections and questions but cannot edit them.
              </p>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-xl font-semibold mb-2">
                  End of Semester Evaluation
                </h3>
                <p className="text-gray-600 mb-6">
                  Standard evaluation form for end of semester feedback
                </p>

                <div className="space-y-8">
                  <div className="border rounded-md p-4">
                    <h4 className="text-lg font-medium mb-2">
                      Teaching Quality
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">
                          How would you rate the overall teaching quality?
                        </p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            Rating question (1-5)
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">
                          What aspects of teaching could be improved?
                        </p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            Text response
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h4 className="text-lg font-medium mb-2">Course Content</h4>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">
                          Was the course content relevant to your learning
                          goals?
                        </p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            Rating question (1-5)
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">
                          What topics would you like to see added or removed?
                        </p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            Text response
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <Button variant="outline" onClick={handleBackToList}>
                  Back to List
                </Button>
                <Button
                  onClick={() =>
                    handleEditQuestionnaire(selectedQuestionnaireId || "1")
                  }
                >
                  Edit Questionnaire
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuestionnairesPage;
