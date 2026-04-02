import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useData } from '@/context/DataContext';

const AdminCategories = () => {
    const { categories: realCategories } = useData();
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', status: true });

    useEffect(() => {
        if (realCategories) {
            setCategories(realCategories);
        }
    }, [realCategories]);

    const filteredCategories = categories.filter(cat =>
        cat.name && cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description || '', status: category.status !== false });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '', status: true });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (editingCategory) {
            setCategories(categories.map(c =>
                c.id === editingCategory.id ? { ...c, ...formData } : c
            ));
        } else {
            setCategories([...categories, {
                id: Math.random().toString(),
                ...formData,
                count: 0
            }]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        setCategories(categories.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Categories</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage product categories and collections</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="rounded-xl shadow-md h-11 px-6 shadow-primary/20 hover:shadow-primary/40 transition-all font-medium">
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex items-center gap-4 bg-gray-50/50">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-10 rounded-xl bg-white"
                        />
                    </div>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="font-display text-xl">{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Category Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Handmade Goods"
                                    className="rounded-xl h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="desc" className="text-sm font-medium">Description</Label>
                                <textarea
                                    id="desc"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Short description of the category..."
                                    className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                />
                            </div>
                            <div className="flex items-center justify-between rounded-xl border p-4 bg-gray-50/50">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-medium">Active Status</Label>
                                    <p className="text-xs text-muted-foreground">Category will be visible on site</p>
                                </div>
                                <Switch
                                    checked={formData.status}
                                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl h-11">Cancel</Button>
                            <Button onClick={handleSave} className="rounded-xl h-11 shadow-md">Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[300px] font-semibold text-foreground">Category Name</TableHead>
                                <TableHead className="font-semibold text-foreground">Count</TableHead>
                                <TableHead className="font-semibold text-foreground">Status</TableHead>
                                <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCategories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-sm text-muted-foreground">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCategories.map((category) => (
                                    <TableRow key={category.id} className="group transition-colors hover:bg-muted/50">
                                        <TableCell>
                                            <div className="font-medium text-sm text-foreground">{category.name}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[250px]">{category.description || 'No description available'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
                                                {category.count || 0} items
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase font-bold ${category.status !== false ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-500 border border-gray-200'
                                                }`}>
                                                {category.status !== false ? 'Active' : 'Inactive'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                                    <DropdownMenuItem onClick={() => handleOpenModal(category)} className="cursor-pointer">
                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(category.id)} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
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
            </div>
        </div>
    );
};

export default AdminCategories;
