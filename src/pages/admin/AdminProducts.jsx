import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, MoreHorizontal, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useData } from '@/context/DataContext';

const AdminProducts = () => {
    const navigate = useNavigate();
    const { products: realProducts } = useData();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (realProducts) {
            setProducts(realProducts);
        }
    }, [realProducts]);

    const filteredProducts = products.filter(product =>
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.categorySlug && product.categorySlug.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active':
            case 'In Stock':
                return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
            case 'Draft':
                return 'bg-gray-100 text-gray-600 border border-gray-200';
            case 'Out of Stock':
                return 'bg-destructive/10 text-destructive border border-destructive/20';
            default:
                return 'bg-gray-100 text-gray-500 border border-gray-200';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Products</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage your inventory and product catalogs</p>
                </div>
                <Button onClick={() => navigate('/admin/products/add')} className="rounded-xl shadow-md h-11 px-6 shadow-primary/20 hover:shadow-primary/40 transition-all font-medium">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11 rounded-xl bg-white shadow-sm"
                        />
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto h-11 rounded-xl bg-white">
                        <Filter className="mr-2 h-4 w-4 text-muted-foreground" /> Filters
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent border-border">
                                <TableHead className="w-[350px] font-semibold text-foreground">Product</TableHead>
                                <TableHead className="font-semibold text-foreground">Category</TableHead>
                                <TableHead className="font-semibold text-foreground">Price</TableHead>
                                <TableHead className="font-semibold text-foreground">Stock</TableHead>
                                <TableHead className="font-semibold text-foreground">Status</TableHead>
                                <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-medium">
                                        No products found matching your search.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id} className="group transition-colors hover:bg-muted/30 cursor-pointer" onClick={() => navigate(`/admin/products/${product.id}`)}>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-white rounded-xl overflow-hidden border border-border shrink-0 touch-none flex items-center justify-center p-1">
                                                    <img
                                                        src={product.images && product.images.length > 0 ? product.images[0] : product.image || ''}
                                                        alt={product.name}
                                                        className="h-full w-full object-contain transition-transform group-hover:scale-105 duration-500"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-foreground mb-0.5 line-clamp-1">{product.name}</div>
                                                    <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{product.brand || product.id}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary/80 text-secondary-foreground text-xs font-semibold">
                                                {product.category || product.categorySlug || 'Uncategorized'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-semibold text-foreground text-sm">
                                            ₹{product.price}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${(!product.stock || product.stock > 10) ? 'bg-emerald-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-destructive'}`} />
                                                <span className="text-xs font-medium">{product.stock || 'In Stock'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(product.status || (product.stock === 0 ? 'Out of Stock' : 'Active'))}`}>
                                                {product.status || (product.stock === 0 ? 'Out of Stock' : 'Active')}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                                    <DropdownMenuItem onClick={() => navigate(`/admin/products/${product.id}`)} className="cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => navigate(`/admin/products/${product.id}?edit=true`)} className="cursor-pointer">
                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit Product
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(product.id)} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
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

export default AdminProducts;
