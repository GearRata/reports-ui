"use client";

import type React from "react";

import { useState } from "react";
import { TypeTable } from "@/components/tables/type-table";
import type { TypeData } from "@/types/type/model";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useType, deleteType } from "@/hooks/useTypes";

function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { types, refreshBranches } = useType();

  const handleAddType = () => {
    router.push("/type/create");
  };

  const handleEditType = (type: TypeData) => {
    // Navigate to edit page with branch ID
    router.push(`/type/edit/${type.id}`);
  };

  // handleTypeSubmit removed - using separate pages for create/edit

  const handleDeleteType = async (id: number) => {
    try {
      await deleteType(id);
      refreshBranches();
    } catch (error) {
      console.error("Error deleting Type:", error);
    }
  };

  const filteredType = types.filter((types) =>
    types.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4 px-2">
              <div className="container mx-auto space-y-6">
                {/* Header with search and add button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-1 items-center space-x-2">
                    <Input
                      placeholder="Filter type..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-[150px] lg:w-[450px]"
                    />
                  </div>
                  <Button
                    onClick={handleAddType}
                    size="sm"
                    className="bg-linear-to-r/srgb from-indigo-500 to-teal-400 text-white  hover:scale-110" 
                  >
                    <Plus className="h-4 w-4 mr-2 " />
                    Add Type
                  </Button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <TypeTable
                    types={filteredType}
                    onEditType={handleEditType}
                    onDeleteType={handleDeleteType}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}

export default Page;
