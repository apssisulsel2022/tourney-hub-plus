import React, { useState } from "react";
import { 
  User, 
  Shield, 
  FileText, 
  Users, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Camera,
  Upload,
  Info
} from "lucide-react";
import { AgeCategory, CreatePlayerInput, Position } from "../types/player";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlayerRegistrationFormProps {
  onSubmit: (data: CreatePlayerInput) => void;
  onCancel: () => void;
}

const steps = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "Club & Position", icon: Shield },
  { id: 3, label: "Documents", icon: FileText },
  { id: 4, label: "Guardian Info", icon: Users },
];

const clubs = [
  { id: "CLB1", name: "FC Thunder", logo: "https://example.com/thunder.png" },
  { id: "CLB2", name: "Red Lions", logo: "https://example.com/lions.png" },
  { id: "CLB3", name: "Phoenix SC", logo: "https://example.com/phoenix.png" },
  { id: "CLB4", name: "United FC", logo: "https://example.com/united.png" },
  { id: "CLB5", name: "Blue Eagles", logo: "https://example.com/eagles.png" },
  { id: "CLB6", name: "Golden Stars", logo: "https://example.com/stars.png" },
];

type FormState = {
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  clubId: string;
  ageCategory: AgeCategory | "";
  primaryPosition: Position | "";
  secondaryPosition: Position | "";
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  documents: File[];
};

export function PlayerRegistrationForm({ onSubmit, onCancel }: PlayerRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    nationality: "",
    clubId: "",
    ageCategory: "" as AgeCategory | "",
    primaryPosition: "" as Position | "",
    secondaryPosition: "" as Position | "",
    guardianName: "",
    guardianRelationship: "",
    guardianPhone: "",
    documents: [] as File[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const isMinor = () => {
    if (!formData.dateOfBirth) return false;
    const birthDate = new Date(formData.dateOfBirth);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age < 18;
  };

  const submit = () => {
    const club = clubs.find(c => c.id === formData.clubId);
    const emergencyContact = {
      name: formData.guardianName || "N/A",
      relationship: formData.guardianRelationship || "N/A",
      phone: formData.guardianPhone || "N/A",
    };

    const input: CreatePlayerInput = {
      name: formData.name,
      photoUrl: undefined,
      dateOfBirth: formData.dateOfBirth,
      clubId: formData.clubId || "CLB1",
      clubName: club?.name ?? "Unknown Club",
      clubLogo: club?.logo,
      ageCategory: (formData.ageCategory || "Senior") as AgeCategory,
      primaryPosition: (formData.primaryPosition || "Multi-position") as Position,
      secondaryPosition: formData.secondaryPosition || undefined,
      nationality: formData.nationality || "Unknown",
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      emergencyContact,
      status: "active",
      documents: formData.documents,
    };

    onSubmit(input);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <Input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="e.g. Cristiano Ronaldo" 
                  className="h-12 rounded-xl border-muted-foreground/20 focus:border-secondary focus:ring-secondary/5 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Date of Birth</Label>
                <Input 
                  type="date" 
                  name="dateOfBirth" 
                  value={formData.dateOfBirth} 
                  onChange={handleChange} 
                  className="h-12 rounded-xl border-muted-foreground/20 focus:border-secondary focus:ring-secondary/5 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nationality</Label>
                <Input 
                  name="nationality" 
                  value={formData.nationality} 
                  onChange={handleChange} 
                  placeholder="e.g. Brazil" 
                  className="h-12 rounded-xl border-muted-foreground/20 focus:border-secondary focus:ring-secondary/5 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                <Input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="cr7@al-nassr.com" 
                  className="h-12 rounded-xl border-muted-foreground/20 focus:border-secondary focus:ring-secondary/5 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                <Input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="+1 234 567 890" 
                  className="h-12 rounded-xl border-muted-foreground/20 focus:border-secondary focus:ring-secondary/5 transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Residential Address</Label>
                <Input 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="123 Football Ave, Soccer City" 
                  className="h-12 rounded-xl border-muted-foreground/20 focus:border-secondary focus:ring-secondary/5 transition-all"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Club Assignment</Label>
                <Select value={formData.clubId} onValueChange={(v) => handleSelectChange("clubId", v)}>
                  <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20">
                    <SelectValue placeholder="Select a club" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {clubs.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Age Category</Label>
                <Select value={formData.ageCategory} onValueChange={(v) => handleSelectChange("ageCategory", v)}>
                  <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="U12">U12</SelectItem>
                    <SelectItem value="U14">U14</SelectItem>
                    <SelectItem value="U16">U16</SelectItem>
                    <SelectItem value="U18">U18</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Primary Position</Label>
                <Select value={formData.primaryPosition} onValueChange={(v) => handleSelectChange("primaryPosition", v)}>
                  <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                    <SelectItem value="Defender">Defender</SelectItem>
                    <SelectItem value="Midfielder">Midfielder</SelectItem>
                    <SelectItem value="Forward">Forward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Secondary Position (Optional)</Label>
                <Select value={formData.secondaryPosition} onValueChange={(v) => handleSelectChange("secondaryPosition", v)}>
                  <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20">
                    <SelectValue placeholder="Select secondary" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                    <SelectItem value="Defender">Defender</SelectItem>
                    <SelectItem value="Midfielder">Midfielder</SelectItem>
                    <SelectItem value="Forward">Forward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-6 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-secondary" />
                </div>
                <div>
                  <h4 className="font-black text-sm">Player Photo</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">PNG, JPG up to 5MB</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl font-bold h-9">
                  Upload Photo
                </Button>
              </div>
              <div className="space-y-4 p-6 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-secondary" />
                </div>
                <div>
                  <h4 className="font-black text-sm">ID Verification</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Passport or ID Card</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl font-bold h-9">
                  Upload Document
                </Button>
              </div>
              <div className="space-y-4 p-6 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-center md:col-span-2">
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-secondary" />
                </div>
                <div>
                  <h4 className="font-black text-sm">Medical Clearance</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Certified Medical Record</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl font-bold h-9">
                  Upload Record
                </Button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {!isMinor() && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3 mb-4">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-blue-700">
                  This player is marked as an adult. Guardian information is optional but recommended for emergency situations.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Guardian Name</Label>
                <Input 
                  name="guardianName" 
                  value={formData.guardianName} 
                  onChange={handleChange} 
                  placeholder="e.g. Mary Jane" 
                  className="h-12 rounded-xl border-muted-foreground/20 focus:border-secondary focus:ring-secondary/5 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Relationship</Label>
                <Select value={formData.guardianRelationship} onValueChange={(v) => handleSelectChange("guardianRelationship", v)}>
                  <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Sibling">Sibling</SelectItem>
                    <SelectItem value="Other">Legal Guardian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Guardian Phone Number</Label>
                <Input 
                  name="guardianPhone" 
                  value={formData.guardianPhone} 
                  onChange={handleChange} 
                  placeholder="+1 987 654 321" 
                  className="h-12 rounded-xl border-muted-foreground/20 focus:border-secondary focus:ring-secondary/5 transition-all"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-[2.5rem] border shadow-xl overflow-hidden border-muted max-w-3xl mx-auto">
      {/* Progress Stepper */}
      <div className="bg-muted/30 border-b p-8 flex justify-between">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          return (
            <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 flex-1">
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                isActive ? "bg-secondary border-secondary text-white shadow-lg shadow-secondary/20 scale-110" : 
                isCompleted ? "bg-success/20 border-success text-success" : 
                "bg-background border-muted text-muted-foreground"
              )}>
                {isCompleted ? <Check className="h-6 w-6" /> : <step.icon className="h-6 w-6" />}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest hidden md:block",
                isActive ? "text-secondary" : isCompleted ? "text-success" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="p-8 md:p-12">
        <div className="mb-10">
          <h3 className="text-2xl font-black tracking-tighter">
            {steps.find(s => s.id === currentStep)?.label}
          </h3>
          <p className="text-muted-foreground font-medium">Please provide the details below to continue.</p>
        </div>

        {renderStep()}

        {/* Form Actions */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-muted">
          <Button 
            variant="ghost" 
            onClick={currentStep === 1 ? onCancel : prevStep}
            className="h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-widest gap-2"
          >
            {currentStep === 1 ? "CANCEL REGISTRATION" : <><ChevronLeft className="h-4 w-4" /> PREVIOUS STEP</>}
          </Button>

          <Button 
            onClick={currentStep === steps.length ? submit : nextStep}
            className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-white font-black rounded-2xl gap-2 shadow-lg shadow-secondary/20 transition-all"
          >
            {currentStep === steps.length ? "COMPLETE REGISTRATION" : <>NEXT STEP <ChevronRight className="h-4 w-4" /></>}
          </Button>
        </div>
      </div>
    </div>
  );
}
