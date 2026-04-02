import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Info, LayoutList, PackageOpen, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock product data
    const product = {
        id: id || 'PROD-001',
        name: 'Premium Wireless Noise-Cancelling Headphones',
        price: 299.99,
        compareAtPrice: 349.99,
        category: 'Electronics',
        status: 'Active',
        stock: 45,
        description: 'Experience immersive sound with our premium wireless headphones. Featuring advanced noise-canceling technology, up to 30 hours of battery life, and ultra-comfortable memory foam ear cushions. Perfect for travel, work, and relaxation.',
        specs: [
            { label: 'Brand', value: 'AudioTech' },
            { label: 'Model', value: 'QuietPro X1' },
            { label: 'Connectivity', value: 'Bluetooth 5.2' },
            { label: 'Battery Life', value: 'Up to 30 hours' },
            { label: 'Weight', value: '250g' }
        ],
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
            'https://images.unsplash.com/photo-1491927570842-0261e477d937?w=800&q=80',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'
        ]
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate('/admin/products')} className="rounded-xl h-10 w-10 shrink-0">
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground line-clamp-1">{product.name}</h1>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 uppercase tracking-wider text-[10px] hidden sm:flex">
                                {product.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm font-mono">{product.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl h-11 hidden sm:flex">
                        <MoreHorizontal className="mr-2 h-4 w-4" /> More
                    </Button>
                    <Button className="rounded-xl h-11 shadow-md shadow-primary/20 px-6 font-medium">
                        <Edit2 className="mr-2 h-4 w-4" /> Edit Product
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Images */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-2 rounded-3xl border border-border shadow-sm">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {product.images.slice(1).map((img, i) => (
                                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-secondary cursor-pointer border-2 border-transparent hover:border-primary transition-colors">
                                    <img src={img} alt={`${product.name} view ${i + 2}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="w-full justify-start border-b border-border rounded-none h-14 bg-transparent p-0">
                            <TabsTrigger value="details" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 font-medium">
                                <Info className="w-4 h-4 mr-2" /> Details
                            </TabsTrigger>
                            <TabsTrigger value="specs" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 font-medium">
                                <LayoutList className="w-4 h-4 mr-2" /> Specifications
                            </TabsTrigger>
                        </TabsList>
                        <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-t-0 border-border p-6 shadow-sm">
                            <TabsContent value="details" className="m-0 focus-visible:outline-none animate-fade-in">
                                <h3 className="text-lg font-semibold mb-3">Product Description</h3>
                                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-3">SEO Preview</h3>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-blue-600 text-lg sm:text-xl font-medium line-clamp-1">{product.name} | Chetak Plus</p>
                                        <p className="text-green-700 text-sm mb-1">https://chetakplus.com/products/{product.id.toLowerCase()}</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="specs" className="m-0 focus-visible:outline-none animate-fade-in">
                                <div className="space-y-0 text-sm">
                                    {product.specs.map((spec, i) => (
                                        <div key={i} className={`flex py-3 px-4 ${i % 2 === 0 ? 'bg-gray-50/50 rounded-lg' : ''}`}>
                                            <span className="w-1/3 font-medium text-muted-foreground">{spec.label}</span>
                                            <span className="w-2/3 font-medium text-foreground">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Right Column: Pricing & Inventory */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-border shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
                        <h3 className="text-lg font-semibold mb-6 flex items-center">
                            <PackageOpen className="w-5 h-5 mr-2 text-primary" /> Core Information
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 block">Pricing</label>
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl font-display font-bold text-foreground">${product.price}</span>
                                    {product.compareAtPrice && (
                                        <span className="text-lg text-muted-foreground line-through mb-1">${product.compareAtPrice}</span>
                                    )}
                                </div>
                            </div>

                            <div className="h-px bg-border my-4" />

                            <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 block">Inventory Details</label>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-3">
                                    <span className="font-medium text-sm">Available Units</span>
                                    <span className="font-bold text-lg">{product.stock}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <span className="font-medium text-sm">Category</span>
                                    <span className="font-semibold text-sm text-primary">{product.category}</span>
                                </div>
                            </div>

                            <div className="h-px bg-border my-4" />

                            <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 block">Organization</label>
                                <div className="space-y-3 mt-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Vendor</span>
                                        <span className="font-medium">Chetak Plus</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Tags</span>
                                        <span className="font-medium">Audio, Best Seller</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-3xl border border-border p-5 text-sm text-center text-muted-foreground">
                        <p>Last edited on Oct 24, 2023 by Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductDetail;
