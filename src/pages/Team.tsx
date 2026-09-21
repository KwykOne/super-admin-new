import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {toast} from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Mail,
  ShieldCheck,
  ShieldAlert,
  UserCog,
  Edit,
  Trash
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import useAdminData from "@/hooks/useSuperAdminData";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import axios from "axios";
import { canonicalizeRole, SUPER_ADMIN_API_ID, TEAM_API_ID } from "@/lib/roles";

const roles = [
  { id: SUPER_ADMIN_API_ID, name: "Super Admin", description: "Full access to all areas" },
  { id: TEAM_API_ID, name: "Team", description: "Standard team access" },
];

export default function Team() {
  const token = localStorage.getItem('userToken')
  const mode = useSelector((state: RootState) => state.modal.mode);

  const baseURL = mode === 'dev'
    ? import.meta.env.VITE_BACKEND_DEV_URL
    : import.meta.env.VITE_BACKEND_PROD_URL;
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const { admins, refreshAdmins } = useAdminData()
  const [newMember, setNewMember] = useState({
    name: "",
    number: "",
    password:"",
    role: TEAM_API_ID
  });

  useEffect(() => {
    setLoading(!admins || admins.length === 0 && loading);
  }, [admins]);

  const filteredMembers = (admins || []).filter(member =>
    member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role_master?.role_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = async () => {
    const loadId = toast.loading("Creating team member");

    try {
      await axios.post(
        `${baseURL}api/v1/admin/register-superadmin`,
        {
          name:newMember.name,
          mobile_no:newMember.number,
          password:newMember.password,
          role_id: newMember.role
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Created team member successfully");
      setShowAddMemberDialog(false);
      setNewMember({ name: "", number: "", password: "", role: TEAM_API_ID });
    } catch (err) {
      toast.error("Error creating team member");
      console.error("Error creating admin:", err);
    } finally {
      toast.dismiss(loadId);
    }
  };

  const handleRemoveMember = async (id: number) => {
    const loadId = toast.loading("Deleting admin");

    try {
      await axios.delete(
        `${baseURL}api/v1/admin/delete-admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Deleted Admin Successfully");
    } catch (err) {
      toast.error("Error Deleting Admin");
      console.error("Error deleting admin:", err);
    } finally {
      toast.dismiss(loadId);
    }
  };

  const toggleMemberStatus = async (id: number) => {
    const loadId = toast.loading("Updating Admin ....");

    try {
      await axios.post(
        `${baseURL}api/v1/admin/toggle-admin-status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Updated admin status");
    } catch (err) {
      toast.error("Error Updating Admin");
      console.error("Error toggling admin status:", err);
    } finally {
      toast.dismiss(loadId);
    }
  };

  const handleUpdateRole = async (id: number, newRoleId: string) => {
    const loadId = toast.loading("Updating role...");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.patch(
        `${baseURL}api/v1/admin/team/${id}`,
        { role_id: Number(newRoleId) },
        { headers },
      );
      await refreshAdmins();
      toast.success("Role updated successfully");
    } catch (err: any) {
      const status = err.response?.status ?? "network";
      const data = err.response?.data;
      const message = typeof data === "string" ? data : data?.message || data?.error || "";
      const detail = message ? `${message}` : `HTTP ${status}`;
      console.error("Error updating role:", { status, data, err });
      if (status === 404) {
        toast.error("Role update is not available. The backend does not have a verified role-update endpoint. Contact the BharatGo backend team to add this API.");
      } else {
        toast.error(`Error updating role (${detail})`);
      }
    } finally {
      toast.dismiss(loadId);
    }
  };

  const getRoleIcon = (role: string) => {
    const canonical = canonicalizeRole(role);
    if (canonical === "Super Admin") return <ShieldAlert className="h-4 w-4 text-red-500" />;
    return <UserCog className="h-4 w-4 text-blue-500" />;
  };

  return (
    <DashboardLayout title="Team Management" subtitle="Manage admin access and permissions">
      <Card className="mb-6 animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage team members and their access levels</CardDescription>
          </div>
          <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus size={16} />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
                <DialogDescription>
                  Add a new member to your BharatGo admin team.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="number" className="text-right text-sm font-medium">
                          Number
                        </label>
                        <Input
                          id="number"
                          type="text"
                          value={newMember.number}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setNewMember({ ...newMember, number: value });
                            }
                          }}
                          className="col-span-3"
                        />
                      </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={newMember.password}
                    onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="role" className="text-right text-sm font-medium">
                    Role
                  </label>
                  <Select
                    value={newMember.role}
                    onValueChange={(value) => setNewMember({...newMember, role: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex flex-col">
                            <span>{role.name}</span>
                            <span className="text-xs text-gray-500">{role.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No team members found matching your search
                      </TableCell>
                    </TableRow>
                  ) : (
                    admins.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="font-medium">{member.name || 'NA'}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail size={12} />
                            {member.mobile_no || 'NA'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getRoleIcon(member.role_master?.role_name)}
                            <span>{canonicalizeRole(member.role_master?.role_name)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                        </TableCell>
                        <TableCell>
                          <Badge variant={ member.is_active === 1 ? "default" : "secondary"} className="text-xs">
                            {member.is_active === 1 ?'Active' : 'Not Active'}
                          </Badge>
                        </TableCell>
                        <TableCell>{member.lastActive || 'NA'}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateRole(member.id, SUPER_ADMIN_API_ID)}>
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                <span>Make Super Admin</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateRole(member.id, TEAM_API_ID)}>
                                <UserCog className="mr-2 h-4 w-4" />
                                <span>Make Team</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleMemberStatus(member.id)}>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                <span>{member.is_active === 1 ? "Make Inactive" : "Make Active"}</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleRemoveMember(member.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Remove</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
