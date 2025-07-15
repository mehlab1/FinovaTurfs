import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, User, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const dummyBookings = [
  {
    id: 1,
    name: "Ali Raza",
    date: "2025-07-15",
    time: "18:00 - 19:00",
    ground: "Finova Turf 1",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Sara Khan",
    date: "2025-07-15",
    time: "19:00 - 20:00",
    ground: "Finova Turf 2",
    status: "Pending",
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    date: "2025-07-16",
    time: "17:00 - 18:00",
    ground: "Finova Turf 1",
    status: "Cancelled",
  },
];

export default function WalkInBookings() {
  const [search, setSearch] = useState("");
  const filtered = dummyBookings.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.ground.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Walk-in Bookings</h1>
          <p className="text-gray-400">Manage and review walk-in bookings at your facility</p>
        </motion.div>
        <Card className="glassmorphic border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="w-6 h-6 text-accent" />
              Recent Walk-in Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4 gap-2">
              <Input
                placeholder="Search by name or ground..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-gray-800 border-gray-700 max-w-xs"
              />
              <Button className="bg-accent text-black hover:bg-opacity-80 ml-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Walk-in Booking
              </Button>
            </div>
            <div className="overflow-x-auto rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Ground</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(b => (
                    <TableRow key={b.id} className="hover:bg-gray-800/40">
                      <TableCell className="font-medium text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-accent" /> {b.name}
                      </TableCell>
                      <TableCell><Calendar className="inline w-4 h-4 mr-1 text-gray-400" />{b.date}</TableCell>
                      <TableCell><Clock className="inline w-4 h-4 mr-1 text-gray-400" />{b.time}</TableCell>
                      <TableCell><Badge className="bg-accent/20 text-accent font-semibold">{b.ground}</Badge></TableCell>
                      <TableCell>
                        {b.status === "Confirmed" && <span className="flex items-center gap-1 text-green-500"><CheckCircle className="w-4 h-4" /> Confirmed</span>}
                        {b.status === "Pending" && <span className="flex items-center gap-1 text-yellow-400"><Clock className="w-4 h-4" /> Pending</span>}
                        {b.status === "Cancelled" && <span className="flex items-center gap-1 text-red-500"><XCircle className="w-4 h-4" /> Cancelled</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filtered.length === 0 && (
                <div className="text-center text-gray-400 py-8">No walk-in bookings found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
