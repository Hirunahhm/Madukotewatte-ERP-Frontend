"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface AddEmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const POSITIONS = ["Tapper", "Lead Tapper", "Senior Tapper", "Junior Tapper", "General Labour", "Assistant Manager"];

export function AddEmployeeDialog({ open, onOpenChange }: AddEmployeeDialogProps) {
    const [name, setName] = useState("");
    const [dateOfJoining, setDateOfJoining] = useState("");
    const [salary, setSalary] = useState("");
    const [position, setPosition] = useState("");

    function handleClose() {
        setName("");
        setDateOfJoining("");
        setSalary("");
        setPosition("");
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="emp-name">Name</Label>
                        <Input
                            id="emp-name"
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="emp-doj">Date of Joining</Label>
                        <Input
                            id="emp-doj"
                            type="date"
                            value={dateOfJoining}
                            onChange={(e) => setDateOfJoining(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="emp-salary">Salary</Label>
                        <Input
                            id="emp-salary"
                            type="number"
                            placeholder="e.g. 45000"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Position</Label>
                        <Select value={position} onValueChange={(v) => { if (v !== null) setPosition(v); }}>
                            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectValue placeholder="Select position..." />
                            </SelectTrigger>
                            <SelectContent>
                                {POSITIONS.map((pos) => (
                                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
                        <Button className="flex-1 bg-brand-500 hover:bg-brand-600">Add Employee</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
