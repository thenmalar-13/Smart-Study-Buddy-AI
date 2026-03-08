import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertConceptExplanation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useConcepts() {
  return useQuery({
    queryKey: [api.concepts.list.path],
    queryFn: async () => {
      const res = await fetch(api.concepts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch concepts");
      const data = await res.json();
      return api.concepts.list.responses[200].parse(data);
    },
  });
}

export function useCreateConcept() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertConceptExplanation) => {
      const validated = api.concepts.create.input.parse(data);
      const res = await fetch(api.concepts.create.path, {
        method: api.concepts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      const resData = await res.json();
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.concepts.create.responses[400].parse(resData);
          throw new Error(error.message || "Validation failed");
        }
        throw new Error(resData.error || "Failed to explain concept");
      }
      
      return api.concepts.create.responses[201].parse(resData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.concepts.list.path] });
      toast({
        title: "Concept Explained",
        description: "Your ELI5 explanation is ready.",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
