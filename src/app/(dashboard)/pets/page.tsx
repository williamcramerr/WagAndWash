"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { cn, formatDate, calculateAge } from "@/lib/utils";
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Dog,
  Cat,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { pets, getClientById, type Pet } from "@/lib/mock-data";

type SortField = "name" | "lastGroomDate" | "breed";

export default function PetsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [speciesFilter, setSpeciesFilter] = React.useState<string>("all");
  const [safetyFilter, setSafetyFilter] = React.useState<string>("all");
  const [sortField, setSortField] = React.useState<SortField>("name");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;

  const filteredPets = React.useMemo(() => {
    let result = [...pets];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (pet) =>
          pet.name.toLowerCase().includes(query) ||
          pet.breed.toLowerCase().includes(query) ||
          getClientById(pet.clientId)?.firstName.toLowerCase().includes(query) ||
          getClientById(pet.clientId)?.lastName.toLowerCase().includes(query)
      );
    }

    if (speciesFilter !== "all") {
      result = result.filter((pet) => pet.species === speciesFilter);
    }

    if (safetyFilter === "with_flags") {
      result = result.filter((pet) => pet.safetyFlags.length > 0);
    } else if (safetyFilter === "no_flags") {
      result = result.filter((pet) => pet.safetyFlags.length === 0);
    }

    result.sort((a, b) => {
      switch (sortField) {
        case "name":
          return a.name.localeCompare(b.name);
        case "breed":
          return a.breed.localeCompare(b.breed);
        case "lastGroomDate":
          return (
            new Date(b.lastGroomDate || 0).getTime() -
            new Date(a.lastGroomDate || 0).getTime()
          );
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, speciesFilter, safetyFilter, sortField]);

  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
  const paginatedPets = filteredPets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const dogCount = pets.filter((p) => p.species === "dog").length;
  const catCount = pets.filter((p) => p.species === "cat").length;
  const flaggedCount = pets.filter((p) => p.safetyFlags.length > 0).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pets"
        description="Manage all pets in your system"
        actions={
          <Button asChild>
            <Link href="/pets/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Pet
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{pets.length}</div>
            <p className="text-xs text-muted-foreground">Total Pets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Dog className="h-5 w-5 text-muted-foreground" />
              <div className="text-2xl font-bold">{dogCount}</div>
            </div>
            <p className="text-xs text-muted-foreground">Dogs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Cat className="h-5 w-5 text-muted-foreground" />
              <div className="text-2xl font-bold">{catCount}</div>
            </div>
            <p className="text-xs text-muted-foreground">Cats</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div className="text-2xl font-bold">{flaggedCount}</div>
            </div>
            <p className="text-xs text-muted-foreground">With Safety Flags</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by pet name, breed, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Species" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Species</SelectItem>
            <SelectItem value="dog">Dogs</SelectItem>
            <SelectItem value="cat">Cats</SelectItem>
          </SelectContent>
        </Select>
        <Select value={safetyFilter} onValueChange={setSafetyFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Safety Flags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pets</SelectItem>
            <SelectItem value="with_flags">With Safety Flags</SelectItem>
            <SelectItem value="no_flags">No Safety Flags</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="breed">Breed</SelectItem>
            <SelectItem value="lastGroomDate">Last Grooming</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedPets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredPets.length)} of{" "}
            {filteredPets.length} pets
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function PetCard({ pet }: { pet: Pet }) {
  const client = getClientById(pet.clientId);
  const hasSafetyFlags = pet.safetyFlags.length > 0;

  return (
    <Link href={`/pets/${pet.id}`}>
      <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-full">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <PetAvatar
              name={pet.name}
              species={pet.species}
              hasSafetyFlags={hasSafetyFlags}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold truncate">{pet.name}</h4>
                {hasSafetyFlags && (
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{pet.breed}</p>
              <p className="text-sm text-muted-foreground">
                {pet.weight} lbs &bull; {calculateAge(pet.dateOfBirth)}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Owner: {client?.firstName} {client?.lastName}
            </p>
            {pet.lastGroomDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Last groomed: {formatDate(pet.lastGroomDate)}
              </div>
            )}
          </div>

          {hasSafetyFlags && (
            <div className="mt-3 flex flex-wrap gap-1">
              {pet.safetyFlags.slice(0, 2).map((flag, i) => (
                <Badge key={i} variant="destructive" className="text-xs">
                  {flag.type}
                </Badge>
              ))}
              {pet.safetyFlags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{pet.safetyFlags.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
