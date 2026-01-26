"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/data-display/empty-state";
import { clients, pets, appointments, getClientById, getPetById, getServiceById } from "@/lib/mock-data";
import {
  Search,
  Users,
  Dog,
  Calendar,
  ChevronRight,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = React.useState(initialQuery);
  const [searchQuery, setSearchQuery] = React.useState(initialQuery);

  // Search results
  const clientResults = React.useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return clients.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    ).slice(0, 10);
  }, [searchQuery]);

  const petResults = React.useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return pets.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.breed.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [searchQuery]);

  const appointmentResults = React.useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return appointments.filter((a) => {
      const client = getClientById(a.clientId);
      const pet = getPetById(a.services[0]?.petId);
      return (
        client?.firstName.toLowerCase().includes(q) ||
        client?.lastName.toLowerCase().includes(q) ||
        pet?.name.toLowerCase().includes(q)
      );
    }).slice(0, 10);
  }, [searchQuery]);

  const totalResults = clientResults.length + petResults.length + appointmentResults.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Search"
        description={searchQuery ? `${totalResults} results for "${searchQuery}"` : "Search across clients, pets, and appointments"}
      />

      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients, pets, appointments..."
            className="pl-10"
            autoFocus
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Results */}
      {searchQuery ? (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">{totalResults}</Badge>
            </TabsTrigger>
            <TabsTrigger value="clients">
              <Users className="h-4 w-4 mr-2" />
              Clients
              <Badge variant="secondary" className="ml-2">{clientResults.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pets">
              <Dog className="h-4 w-4 mr-2" />
              Pets
              <Badge variant="secondary" className="ml-2">{petResults.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
              <Badge variant="secondary" className="ml-2">{appointmentResults.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {totalResults === 0 ? (
              <EmptyState
                icon={Search}
                title="No results found"
                description={`No matches found for "${searchQuery}". Try a different search term.`}
              />
            ) : (
              <>
                {/* Clients Section */}
                {clientResults.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Clients ({clientResults.length})
                      </h3>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/clients?search=${searchQuery}`}>View all</Link>
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {clientResults.slice(0, 3).map((client) => (
                        <Link key={client.id} href={`/clients/${client.id}`}>
                          <Card className="hover:bg-accent/50 transition-colors">
                            <CardContent className="py-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {client.firstName[0]}{client.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {client.firstName} {client.lastName}
                                  </p>
                                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {client.phone}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {client.email}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pets Section */}
                {petResults.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Dog className="h-4 w-4" />
                        Pets ({petResults.length})
                      </h3>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/pets?search=${searchQuery}`}>View all</Link>
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {petResults.slice(0, 3).map((pet) => {
                        const owner = getClientById(pet.clientId);
                        return (
                          <Link key={pet.id} href={`/pets/${pet.id}`}>
                            <Card className="hover:bg-accent/50 transition-colors">
                              <CardContent className="py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                                    {pet.species === "dog" ? "🐕" : "🐈"}
                                  </div>
                                  <div>
                                    <p className="font-medium">{pet.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {pet.breed} • {owner?.firstName} {owner?.lastName}
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Appointments Section */}
                {appointmentResults.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Appointments ({appointmentResults.length})
                      </h3>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/appointments?search=${searchQuery}`}>View all</Link>
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {appointmentResults.slice(0, 3).map((apt) => {
                        const client = getClientById(apt.clientId);
                        const pet = getPetById(apt.services[0]?.petId);
                        const service = getServiceById(apt.services[0]?.serviceId);
                        return (
                          <Link key={apt.id} href={`/appointments/${apt.id}`}>
                            <Card className="hover:bg-accent/50 transition-colors">
                              <CardContent className="py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                                    <Calendar className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {client?.firstName} {client?.lastName} - {pet?.name}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {format(new Date(apt.startTime), "MMM d, h:mm a")}
                                      </span>
                                      <span>•</span>
                                      <span>{service?.name}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={
                                    apt.status === "completed" ? "default" :
                                    apt.status === "confirmed" ? "secondary" :
                                    apt.status === "canceled" ? "destructive" : "outline"
                                  }>
                                    {apt.status}
                                  </Badge>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="clients">
            {clientResults.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No clients found"
                description={`No clients match "${searchQuery}".`}
              />
            ) : (
              <div className="space-y-2">
                {clientResults.map((client) => (
                  <Link key={client.id} href={`/clients/${client.id}`}>
                    <Card className="hover:bg-accent/50 transition-colors">
                      <CardContent className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {client.firstName[0]}{client.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {client.firstName} {client.lastName}
                            </p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {client.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {client.email}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pets">
            {petResults.length === 0 ? (
              <EmptyState
                icon={Dog}
                title="No pets found"
                description={`No pets match "${searchQuery}".`}
              />
            ) : (
              <div className="space-y-2">
                {petResults.map((pet) => {
                  const owner = getClientById(pet.clientId);
                  return (
                    <Link key={pet.id} href={`/pets/${pet.id}`}>
                      <Card className="hover:bg-accent/50 transition-colors">
                        <CardContent className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                              {pet.species === "dog" ? "🐕" : "🐈"}
                            </div>
                            <div>
                              <p className="font-medium">{pet.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {pet.breed} • {owner?.firstName} {owner?.lastName}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="appointments">
            {appointmentResults.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No appointments found"
                description={`No appointments match "${searchQuery}".`}
              />
            ) : (
              <div className="space-y-2">
                {appointmentResults.map((apt) => {
                  const client = getClientById(apt.clientId);
                  const pet = getPetById(apt.services[0]?.petId);
                  const service = getServiceById(apt.services[0]?.serviceId);
                  return (
                    <Link key={apt.id} href={`/appointments/${apt.id}`}>
                      <Card className="hover:bg-accent/50 transition-colors">
                        <CardContent className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {client?.firstName} {client?.lastName} - {pet?.name}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(apt.startTime), "MMM d, h:mm a")}
                                </span>
                                <span>•</span>
                                <span>{service?.name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              apt.status === "completed" ? "default" :
                              apt.status === "confirmed" ? "secondary" :
                              apt.status === "canceled" ? "destructive" : "outline"
                            }>
                              {apt.status}
                            </Badge>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <EmptyState
          icon={Search}
          title="Start searching"
          description="Enter a search term to find clients, pets, or appointments."
        />
      )}
    </div>
  );
}
