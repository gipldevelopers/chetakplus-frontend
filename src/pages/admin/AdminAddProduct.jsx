import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle2, ChevronRight, Image as ImageIcon, Plus, X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const steps = [
    { id: 1, title: 'Basic Info' },
    { id: 2, title: 'Media & Text' },
    { id: 3, title: 'Attributes' },
    { id: 4, title: 'Review' },
];

const TagInput = ({ tags, onAdd, onRemove, placeholder }) => {
    const [input, setInput] = useState('');
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            onAdd(input.trim());
            setInput('');
        }
    };
    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, idx) => (
                    <span key={idx} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                        {tag}
                        <button type="button" onClick={() => onRemove(idx)} className="text-muted-foreground hover:text-foreground">
                            <X size={12} />
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="h-10 rounded-xl"
                />
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => { if (input.trim()) { onAdd(input.trim()); setInput(''); } }}
                    className="h-10 rounded-xl"
                >
                    Add
                </Button>
            </div>
        </div>
    );
};

const AdminAddProduct = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State matching real products structure
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        slug: '',
        category: '',
        badge: '',
        price: '',
        originalPrice: '',
        inStock: true,
        shortDescription: '',
        description: '',
        features: [],
        perfectFor: [],
        images: [],
        specifications: [{ key: '', value: '' }],
        variants: [{ label: '', options: [] }]
    });

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...formData.specifications];
        newSpecs[index][field] = value;
        setFormData(prev => ({ ...prev, specifications: newSpecs }));
    };

    const addSpec = () => {
        setFormData(prev => ({ ...prev, specifications: [...prev.specifications, { key: '', value: '' }] }));
    };
    const removeSpec = (index) => {
        setFormData(prev => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== index) }));
    };

    const addVariant = () => {
        setFormData(prev => ({ ...prev, variants: [...prev.variants, { label: '', options: [] }] }));
    };
    const removeVariant = (index) => {
        setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
    };
    const handleVariantLabelChange = (index, value) => {
        const newVars = [...formData.variants];
        newVars[index].label = value;
        setFormData(prev => ({ ...prev, variants: newVars }));
    };
    const addVariantOption = (variantIndex, value) => {
        const newVars = [...formData.variants];
        if (!newVars[variantIndex].options.includes(value)) {
            newVars[variantIndex].options.push(value);
            setFormData(prev => ({ ...prev, variants: newVars }));
        }
    };
    const removeVariantOption = (variantIndex, optionIndex) => {
        const newVars = [...formData.variants];
        newVars[variantIndex].options = newVars[variantIndex].options.filter((_, i) => i !== optionIndex);
        setFormData(prev => ({ ...prev, variants: newVars }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => navigate('/admin/products'), 1500);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in relative pb-20 font-sans">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate('/admin/products')} className="rounded-xl h-10 w-10">
                    <ArrowLeft size={18} />
                </Button>
                <div>
                    <h1 className="text-3xl font-sans font-bold text-foreground">Add New Product</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Create a new product listing with all dynamic attributes</p>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 mb-8">
                <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 rounded-full z-0" />
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-500 ease-in-out"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;
                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110' :
                                    isCompleted ? 'bg-primary text-primary-foreground' :
                                        'bg-secondary text-muted-foreground'
                                    }`}>
                                    {isCompleted ? <CheckCircle2 size={20} /> : step.id}
                                </div>
                                <span className={`text-xs font-semibold hidden sm:block ${isActive ? 'text-primary' : 'text-muted-foreground'
                                    }`}>{step.title}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-8">

                    {/* STEP 1: BASIC INFO */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-sans font-semibold mb-6">General Information</h2>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label className="text-sm font-medium">Product Name</Label>
                                    <Input
                                        placeholder="e.g. Premium Hard Binding Note Diary"
                                        className="h-12 rounded-xl"
                                        value={formData.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Brand</Label>
                                    <Input
                                        placeholder="e.g. ChetakPlus"
                                        className="h-12 rounded-xl"
                                        value={formData.brand}
                                        onChange={e => handleChange('brand', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Slug (URL)</Label>
                                    <Input
                                        placeholder="e.g. premium-diary"
                                        className="h-12 rounded-xl"
                                        value={formData.slug}
                                        onChange={e => handleChange('slug', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Category</Label>
                                    <Select value={formData.category} onValueChange={v => handleChange('category', v)}>
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="notebooks">Notebooks</SelectItem>
                                            <SelectItem value="planners">Planners</SelectItem>
                                            <SelectItem value="office-stationery">Office Stationery</SelectItem>
                                            <SelectItem value="journals">Journals</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Marketing Badge</Label>
                                    <Input
                                        placeholder="e.g. New Arrival, Best Seller"
                                        className="h-12 rounded-xl"
                                        value={formData.badge}
                                        onChange={e => handleChange('badge', e.target.value)}
                                    />
                                </div>

                                <div className="sm:col-span-2 mt-4 space-y-4 border-t border-border pt-6">
                                    <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground">Pricing & Logic</h3>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Selling Price (₹)</Label>
                                            <Input
                                                type="number"
                                                placeholder="159"
                                                className="h-12 rounded-xl"
                                                value={formData.price}
                                                onChange={e => handleChange('price', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Original Price (₹)</Label>
                                            <Input
                                                type="number"
                                                placeholder="220"
                                                className="h-12 rounded-xl"
                                                value={formData.originalPrice}
                                                onChange={e => handleChange('originalPrice', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-3 pt-8">
                                            <Switch
                                                checked={formData.inStock}
                                                onCheckedChange={v => handleChange('inStock', v)}
                                            />
                                            <Label className="text-sm font-medium cursor-pointer">Product is In Stock</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: MEDIA & TEXT */}
                    {currentStep === 2 && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <h2 className="text-xl font-sans font-semibold mb-4">Product Images</h2>

                                {formData.images && formData.images.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-2xl border border-border overflow-hidden group bg-gray-50 flex items-center justify-center">
                                                <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => {
                                                    const newImages = [...formData.images];
                                                    newImages.splice(idx, 1);
                                                    handleChange('images', newImages);
                                                }} className="absolute top-2 right-2 bg-white/90 text-destructive p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <label className="block border-2 border-dashed border-border rounded-3xl p-12 text-center hover:bg-gray-50/50 transition-colors cursor-pointer group relative">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                handleChange('images', [...(formData.images || []), ...Array.from(e.target.files)]);
                                            }
                                        }}
                                    />
                                    <div className="w-20 h-20 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload size={32} />
                                    </div>
                                    <h3 className="text-lg font-sans font-medium text-foreground mb-1">
                                        {formData.images && formData.images.length > 0 ? 'Upload more images' : 'Click to upload image gallery'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Main image will be the first one listed. Upload multiple files at once.</p>
                                </label>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xl font-sans font-semibold">Copywriting</h2>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Short Description (Appears on lists/cards)</Label>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:ring-primary/20 resize-y transition-shadow"
                                        placeholder="Elegant hard-bound diary with premium paper..."
                                        value={formData.shortDescription}
                                        onChange={e => handleChange('shortDescription', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Full Comprehensive Description</Label>
                                    <textarea
                                        className="flex min-h-[160px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:ring-primary/20 resize-y transition-shadow"
                                        placeholder="Write a comprehensive description of the product features, specifications, and benefits..."
                                        value={formData.description}
                                        onChange={e => handleChange('description', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: ATTRIBUTES & VARIANTS (THE COMPLEX DATA) */}
                    {currentStep === 3 && (
                        <div className="space-y-10 animate-fade-in">

                            {/* Product Variations */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-sans font-semibold">Product Options / Variants</h2>
                                        <p className="text-sm text-muted-foreground mt-1">Add options like Size, Color, or Pages (e.g. A5, B5, 96 Pages)</p>
                                    </div>
                                    <Button type="button" onClick={addVariant} variant="outline" className="rounded-xl h-10 shadow-sm text-xs border-primary text-primary hover:bg-primary/5">
                                        <Plus size={16} className="mr-1" /> Add Variant Type
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {formData.variants.map((v, vIndex) => (
                                        <div key={vIndex} className="p-5 border border-border bg-gray-50/50 rounded-2xl relative">
                                            <button onClick={() => removeVariant(vIndex)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive">
                                                <X size={18} />
                                            </button>
                                            <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Option Name</Label>
                                                    <Input
                                                        placeholder="e.g. Size or Pages"
                                                        className="bg-white h-11"
                                                        value={v.label}
                                                        onChange={e => handleVariantLabelChange(vIndex, e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Option Values (Press Enter to add)</Label>
                                                    <TagInput
                                                        placeholder="e.g. A5, B5, 96 Pages..."
                                                        tags={v.options}
                                                        onAdd={(val) => addVariantOption(vIndex, val)}
                                                        onRemove={(optIdx) => removeVariantOption(vIndex, optIdx)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.variants.length === 0 && (
                                        <div className="text-center p-8 border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
                                            No variants added. This will just be a simple product.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Specifications Sub-Table */}
                            <div className="pt-8 border-t border-border">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-sans font-semibold">Technical Specifications</h2>
                                        <p className="text-sm text-muted-foreground mt-1">Structured Key-Value details (e.g. Paper Quality: 70 GSM)</p>
                                    </div>
                                    <Button type="button" onClick={addSpec} variant="outline" className="rounded-xl h-10 shadow-sm text-xs">
                                        <Plus size={16} className="mr-1" /> Add Row
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {formData.specifications.map((spec, sIndex) => (
                                        <div key={sIndex} className="flex items-center gap-3">
                                            <Input
                                                placeholder="Specification (e.g. GSM)"
                                                className="flex-1 h-11 rounded-xl"
                                                value={spec.key}
                                                onChange={e => handleSpecChange(sIndex, 'key', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Value (e.g. 70)"
                                                className="flex-[2] h-11 rounded-xl"
                                                value={spec.value}
                                                onChange={e => handleSpecChange(sIndex, 'value', e.target.value)}
                                            />
                                            <Button onClick={() => removeSpec(sIndex)} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0">
                                                <X size={20} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tag Grids for specific flags */}
                            <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-border">
                                <div>
                                    <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-4">Bullet Features</h3>
                                    <TagInput
                                        placeholder="e.g. Lay-flat binding..."
                                        tags={formData.features}
                                        onAdd={(val) => setFormData(p => ({ ...p, features: [...p.features, val] }))}
                                        onRemove={(idx) => setFormData(p => ({ ...p, features: p.features.filter((_, i) => i !== idx) }))}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-4">Perfect For Tags</h3>
                                    <TagInput
                                        placeholder="e.g. Students, Gifting..."
                                        tags={formData.perfectFor}
                                        onAdd={(val) => setFormData(p => ({ ...p, perfectFor: [...p.perfectFor, val] }))}
                                        onRemove={(idx) => setFormData(p => ({ ...p, perfectFor: p.perfectFor.filter((_, i) => i !== idx) }))}
                                    />
                                </div>
                            </div>

                        </div>
                    )}

                    {/* STEP 4: REVIEW */}
                    {currentStep === 4 && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-sans font-semibold mb-6">Final Review</h2>

                            <div className="bg-gray-50/80 rounded-2xl p-6 border border-border space-y-6">
                                <div>
                                    <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-4">General Data</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Name</span>
                                            <p className="font-semibold text-foreground mt-1 text-base">{formData.name || '—'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Original Price</span>
                                            <p className="line-through text-muted-foreground mt-1 text-base">₹{formData.originalPrice || '—'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Selling Price</span>
                                            <p className="font-semibold text-emerald-600 mt-1 text-base">₹{formData.price || '—'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Status / Stock</span>
                                            <p className={`font-semibold mt-1 text-base ${formData.inStock ? 'text-primary' : 'text-destructive'}`}>
                                                {formData.inStock ? 'Active & Listed' : 'Out of Stock'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {(formData.variants.length > 0 && formData.variants[0].label !== '') && (
                                    <>
                                        <div className="h-px bg-border" />
                                        <div>
                                            <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-3">Configured Variants</h3>
                                            <div className="flex flex-wrap gap-4">
                                                {formData.variants.filter(v => v.label).map((v, i) => (
                                                    <div key={i} className="bg-white border border-border rounded-xl px-4 py-2 shadow-sm text-sm">
                                                        <span className="text-muted-foreground font-medium mr-2">{v.label}:</span>
                                                        <span className="font-semibold">{v.options.join(', ') || 'None'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="p-6 border-t border-border bg-gray-50/50 flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1 || isSubmitting}
                        className="rounded-xl h-12 px-6 shadow-sm"
                    >
                        Back
                    </Button>

                    {currentStep < steps.length ? (
                        <Button onClick={nextStep} className="rounded-xl h-12 px-8 shadow-md shadow-primary/20">
                            Next Step <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-xl h-12 px-10 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white">
                            {isSubmitting ? 'Saving Framework...' : 'Save Complete Product'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAddProduct;
