"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import {
  getTypeById,
  updateType,
} from "@/hooks/useTypes";
import type { TypeData } from "@/types/type/model";
import { ArrowLeft } from 'lucide-react';

function EditTypePage() {
  const router = useRouter();
  const params = useParams();
  const typeId = params.id as string;

  const [type, setType] = useState<TypeData | null>(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load the specific type data
  useEffect(() => {
    const loadType = async () => {
      if (typeId) {
        try {
          const typeData = await getTypeById(Number(typeId));
          setType(typeData);
          setName(typeData.name);
          setLoading(false);

          console.log(typeData);
        } catch (error) {
          console.error("Error loading type:", error);
          setLoading(false);
        }
      }
    };

    loadType();
  }, [typeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;
    
    setIsSubmitting(true);

    try {
      await updateType(type.id, {name} );
      // Navigate back to type page
      router.push('/type');
    } catch (error) {
      console.error("Error updating type:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/type');
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading type...</p>
        </div>
      </div>
    );
  }

  if (!type) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Type not found</p>
          <Button onClick={handleCancel}>Back to Types</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4 px-2">
          <div className="container mx-auto max-w-2xl">
            <div className="flex mb-3">
              <Button variant="outline" onClick={() => router.back()}><ArrowLeft/>Back</Button>
            </div>
            {/* Edit Type Form */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Type: {type.name}</CardTitle>
                <CardDescription>
                  Update the type details below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Type Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Type Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter type name"
                      required
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !name?.trim()}
                      className="text-white"
                    >
                      {isSubmitting ? "Updating..." : "Update Type"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTypePage;
