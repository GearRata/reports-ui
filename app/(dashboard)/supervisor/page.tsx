"use client";

import type React from "react";
import { AssignToTable } from "@/components/tables/supervisor-table";
import { useAssign, deleteAssignTo } from "@/hooks/useAssign";
import type { AssignData } from "@/types/assignto/model";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const { assignTo, refreshAssigningTo} = useAssign();

  const handleAddAssignTo = () => {
    router.push("/supervisor/create");
  };

  const handleEditAssignTo = (assign: AssignData) => {
    // Navigate to edit page with branch ID
    router.push(`/supervisor/edit/${assign.id}`);
  };

  // handleBranchSubmit removed - using separate pages for create/edit

  const handleDeleteAssignTo = async (id: number) => {
    try {
      await deleteAssignTo(id);
      refreshAssigningTo();
    } catch (error) {
      console.error("Error deleting assign:", error);
    }
  };

  return (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4 px-2">
              <div className="container mx-auto space-y-6">
                {/* Header with search and add button */}
                <div className="flex items-center justify-between">
                  <Button
                    onClick={handleAddAssignTo}
                    size="sm"
                    className="ml-auto h-8 bg-linear-to-r/srgb from-indigo-500 to-teal-400 text-white hover:scale-110"
                  >
                    <Plus className="h-4 w-4 mr-2 " />
                    Add Supervisor
                  </Button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <AssignToTable
                    assignto={assignTo}
                    handleEditAssignTo={handleEditAssignTo}
                    handleDeleteAssignTo={handleDeleteAssignTo}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}

export default Page;
