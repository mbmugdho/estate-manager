'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft,
  Upload,
  X,
  Save,
  ImagePlus,
  Building2,
  MapPin,
  Phone,
} from 'lucide-react'

// property types
const propertyTypes = ['Apartment', 'Villa', 'Townhouse', 'Plot', 'Office', 'Studio', 'Penthouse']
const priceTypes = ['Sale', 'Rent']
const statusOptions = ['Available', 'Sold', 'Rented']
const bedroomOptions = [1, 2, 3, 4, 5, 6]
const bathroomOptions = [1, 2, 3, 4, 5]

export default function PropertyForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    price_type: 'Sale',
    property_type: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: '',
    city: '',
    location: '',
    address: '',
    status: 'Available',
    featured: false,
    whatsapp_number: '',
    phone_number: '',
  })

  // image state
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // update form field
  function updateField(field: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // handle image selection
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // max 8 images
    const remaining = 8 - imageFiles.length
    const newFiles = files.slice(0, remaining)

    setImageFiles((prev) => [...prev, ...newFiles])

    // generate previews
    newFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  // remove image
  function removeImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // upload images to supabase storage
  async function uploadImages(): Promise<string[]> {
    const urls: string[] = []

    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `properties/${fileName}`

      const { error } = await supabase.storage
        .from('property-images')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath)

      urls.push(publicUrl)
    }

    return urls
  }

  // handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // upload images first
      let imageUrls: string[] = []
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages()
      }

      // insert property
      const { error } = await supabase.from('properties').insert({
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        price_type: form.price_type.toLowerCase(),
        property_type: form.property_type.toLowerCase(),
        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms,
        area_sqft: parseInt(form.area_sqft),
        city: form.city,
        location: form.location,
        address: form.address,
        status: form.status.toLowerCase(),
        featured: form.featured,
        whatsapp_number: form.whatsapp_number,
        phone_number: form.phone_number,
        images: imageUrls,
      })

      if (error) throw error

      setSuccess(true)

      // redirect after 1.5s
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1500)

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-[#0F1C2E] text-sm font-medium mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F1C2E]">Add New Property</h1>
        <p className="text-gray-400 text-sm mt-1">Fill in the details to create a new listing</p>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit}>

        {/* basic info section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0F1C2E] rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F1C2E]">Basic Information</h2>
              <p className="text-gray-400 text-xs">Property title, description, and type</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* title — full width */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Property Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Luxury 3BHK Apartment in Downtown"
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F1C2E] placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all duration-200"
              />
            </div>

            {/* description — full width */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe the property features, amenities, nearby attractions..."
                required
                rows={5}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F1C2E] placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all duration-200 resize-none"
              />
            </div>

            {/* property type */}
            <div>
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Property Type <span className="text-red-400">*</span>
              </label>
              <select
                value={form.property_type}
                onChange={(e) => updateField('property_type', e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F1C2E] focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all duration-200 cursor-pointer"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* listing type */}
            <div>
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Listing Type <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-3">
                {priceTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField('price_type', type)}
                    className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                      form.price_type === type
                        ? 'bg-[#0F1C2E] text-white'
                        : 'bg-gray-50 border border-gray-200 text-gray-500 hover:border-[#C9A84C]'
                    }`}
                  >
                    For {type}
                  </button>
                ))}
              </div>
            </div>

            {/* price */}
            <div>
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Price ($) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                placeholder="450000"
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F1C2E] placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all duration-200"
              />
            </div>

            {/* status */}
            <div>
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Status <span className="text-red-400">*</span>
              </label>
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F1C2E] focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all duration-200 cursor-pointer"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* bedrooms */}
            <div>
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Bedrooms
              </label>
              <div className="flex gap-2">
                {bedroomOptions.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => updateField('bedrooms', num)}
                    className={`w-12 h-12 rounded-xl text-sm font-bold transition-all duration-200 ${
                      form.bedrooms === num
                        ? 'bg-[#0F1C2E] text-white'
                        : 'bg-gray-50 border border-gray-200 text-gray-500 hover:border-[#C9A84C]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* bathrooms */}
            <div>
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Bathrooms
              </label>
              <div className="flex gap-2">
                {bathroomOptions.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => updateField('bathrooms', num)}
                    className={`w-12 h-12 rounded-xl text-sm font-bold transition-all duration-200 ${
                      form.bathrooms === num
                        ? 'bg-[#0F1C2E] text-white'
                        : 'bg-gray-50 border border-gray-200 text-gray-500 hover:border-[#C9A84C]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* area */}
            <div>
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Area (sq ft) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={form.area_sqft}
                onChange={(e) => updateField('area_sqft', e.target.value)}
                placeholder="1800"
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F1C2E] placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all duration-200"
              />
            </div>

            {/* featured toggle */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-[#0F1C2E]">Featured Property</label>
              <button
                type="button"
                onClick={() => updateField('featured', !form.featured)}
                className={`w-14 h-7 rounded-full transition-all duration-300 ${
                  form.featured ? 'bg-[#C9A84C]' : 'bg-gray-200'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  form.featured ? 'translate-x-8' : 'translate-x-1'
                }`} />
              </button>
            </div>

          </div>
        </div>

        {/* location section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0F1C2E] rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F1C2E]">Location Details</h2>
              <p className="text-gray-400 text-xs">City, neighborhood, and full address</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* city */}
            <div>
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="e.g. Houston"
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F1C2E] placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all duration-200"
              />
            </div>

            {/* location / neighborhood */}
            <div>
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Neighborhood / Area
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="e.g. Downtown, Midtown"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F1C2E] placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all duration-200"
              />
            </div>

            {/* address — full width */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Full Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="e.g. 1234 Main Street, Suite 100, Houston, TX 77001"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F1C2E] placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all duration-200"
              />
            </div>

          </div>
        </div>

        {/* contact section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0F1C2E] rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F1C2E]">Contact Information</h2>
              <p className="text-gray-400 text-xs">WhatsApp and phone for client inquiries</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* whatsapp */}
            <div>
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={form.whatsapp_number}
                onChange={(e) => updateField('whatsapp_number', e.target.value)}
                placeholder="e.g. +18001234567"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F1C2E] placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all duration-200"
              />
            </div>

            {/* phone */}
            <div>
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={form.phone_number}
                onChange={(e) => updateField('phone_number', e.target.value)}
                placeholder="e.g. +18001234567"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F1C2E] placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all duration-200"
              />
            </div>

          </div>
        </div>

        {/* image upload section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0F1C2E] rounded-xl flex items-center justify-center">
              <ImagePlus className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F1C2E]">Property Images</h2>
              <p className="text-gray-400 text-xs">Upload up to 8 images (JPG, PNG, WebP)</p>
            </div>
          </div>

          {/* upload area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-[#C9A84C] rounded-2xl p-8 text-center cursor-pointer transition-colors duration-200 mb-6"
          >
            <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500 mb-1">Click to upload images</p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP — Max 5MB each — Up to 8 images</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* image previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* first image badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-[#C9A84C] text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      COVER
                    </div>
                  )}
                  {/* remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-green-800 text-sm font-bold">Property Added Successfully!</p>
              <p className="text-green-600 text-xs">Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        {/* submit button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#C9A84C] hover:bg-[#B8943F] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving Property...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Property
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-8 py-4 rounded-xl transition-colors duration-200"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}