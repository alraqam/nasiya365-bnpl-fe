import { Box, Button, Card, Grid, MenuItem, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import Icon from 'src/@core/components/icon/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import { useLang } from 'src/providers/LanguageProvider'
import { useCreateProduct, useCategories } from 'src/hooks/api'
import { useRouter } from 'next/router'
import checkRequiredFields from 'src/@core/utils/check-required-fields'
import CollapsibleSection from 'src/@core/components/CollapsibleSection'
import { CreateProductRequest } from 'src/@core/types/product'

const initialFormState: CreateProductRequest & { brand_id?: number } = {
  name: '',
  category_id: 0,
  price: 0,
  stock_quantity: 0,
  cost_price: undefined,
  description: undefined,
  sku: undefined,
  barcode: undefined,
  brand_id: undefined,
  min_stock_level: undefined,
  is_serialized: false
}

const requiredFields: (keyof typeof initialFormState)[] = ['name', 'category_id', 'price', 'stock_quantity']

const CreateProduct = () => {
  const { t } = useLang()
  const router = useRouter()
  const { createProduct, loading } = useCreateProduct()
  const { categories, loading: categoriesLoading } = useCategories()

  const [form, setForm] = useState(initialFormState)

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (field === 'category_id' || field === 'price' || field === 'stock_quantity' || field === 'cost_price' || field === 'brand_id' || field === 'min_stock_level') {
      setForm(prev => ({ ...prev, [field]: value === '' ? undefined : Number(value) }))
    } else {
      setForm(prev => ({ ...prev, [field]: value === '' ? undefined : value }))
    }
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, is_serialized: event.target.checked }))
  }

  const handleSelectChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (field === 'category_id' || field === 'brand_id') {
      setForm(prev => ({ ...prev, [field]: value === '' ? undefined : Number(value) }))
    } else {
      setForm(prev => ({ ...prev, [field]: value === '' ? undefined : value }))
    }
  }

  const onCancel = () => {
    setForm(initialFormState)
  }

  const onSubmit = async () => {
    try {
      const productData: CreateProductRequest = {
        name: form.name,
        category_id: form.category_id,
        price: form.price,
        stock_quantity: form.stock_quantity,
        ...(form.cost_price !== undefined && { cost_price: form.cost_price }),
        ...(form.description && { description: form.description }),
        ...(form.sku && { sku: form.sku }),
        ...(form.barcode && { barcode: form.barcode }),
        ...(form.brand_id && { brand_id: form.brand_id }),
        ...(form.min_stock_level !== undefined && { min_stock_level: form.min_stock_level }),
        ...(form.is_serialized !== undefined && { is_serialized: form.is_serialized })
      }
      
      await createProduct(productData)
      router.push('/products')
    } catch (error) {
      // Error is handled by the hook and global toast
    }
  }

  return (
    <Stack sx={{ flexDirection: 'column', gap: 5 }}>
      <Box display='flex' gap={1} alignItems='center'>
        <Link href='/products' passHref legacyBehavior>
          <Box component='a' sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Title title={t.pages.products || 'Products'} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
          </Box>
        </Link>
        <Typography variant='h6' color='#7F7F7FE5'>
          /
        </Typography>
        <Title title={t['add-product'] || 'Add Product'} />
      </Box>

      {/* Basic Information */}
      <CollapsibleSection title={t.forms?.products?.['basic-info'] || 'Basic Information'} defaultOpen>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography>
              {t.forms?.products?.name || 'Product Name'} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField fullWidth value={form.name} onChange={handleChange('name')} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              {t.forms?.products?.category || 'Category'} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField
              select
              fullWidth
              value={form.category_id || ''}
              onChange={handleSelectChange('category_id')}
              disabled={categoriesLoading}
            >
              {categories?.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              {t.forms?.products?.['selling-price'] || t.forms?.products?.price || 'Price'} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField
              fullWidth
              type='number'
              value={form.price || ''}
              onChange={handleChange('price')}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms?.products?.['cost-price'] || 'Cost Price'}</Typography>
            <CustomTextField
              fullWidth
              type='number'
              value={form.cost_price || ''}
              onChange={handleChange('cost_price')}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              {t.forms?.products?.['stock-quantity'] || 'Stock Quantity'} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField
              fullWidth
              type='number'
              value={form.stock_quantity || ''}
              onChange={handleChange('stock_quantity')}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms?.products?.['min-stock-level'] || 'Min Stock Level'}</Typography>
            <CustomTextField
              fullWidth
              type='number'
              value={form.min_stock_level || ''}
              onChange={handleChange('min_stock_level')}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography>{t.forms?.products?.description || 'Description'}</Typography>
            <CustomTextField
              fullWidth
              multiline
              rows={4}
              value={form.description || ''}
              onChange={handleChange('description')}
            />
          </Grid>
        </Grid>
      </CollapsibleSection>

      {/* Additional Information */}
      <CollapsibleSection title={t.forms?.products?.['additional-info'] || 'Additional Information'}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography>{t.forms?.products?.sku || 'SKU'}</Typography>
            <CustomTextField fullWidth value={form.sku || ''} onChange={handleChange('sku')} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms?.products?.barcode || 'Barcode'}</Typography>
            <CustomTextField fullWidth value={form.barcode || ''} onChange={handleChange('barcode')} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display='flex' alignItems='center' gap={1}>
              <input
                type='checkbox'
                checked={form.is_serialized || false}
                onChange={handleCheckboxChange}
                id='is_serialized'
              />
              <Typography component='label' htmlFor='is_serialized' sx={{ cursor: 'pointer' }}>
                {t.forms?.products?.['is-serialized'] || 'Is Serialized'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CollapsibleSection>

      <Stack direction='row' justifyContent='flex-start' gap={3}>
        <Button
          disabled={loading || checkRequiredFields(requiredFields, form)}
          variant='contained'
          onClick={onSubmit}
          sx={{ width: { md: 'max-content', xs: '100%' } }}
        >
          {t.forms?.submit || 'Submit'}
        </Button>
        <Button
          variant='outlined'
          onClick={onCancel}
          sx={{ width: { md: 'max-content', xs: '100%' } }}
        >
          {t.forms?.cancel || 'Cancel'}
        </Button>
      </Stack>
    </Stack>
  )
}

export default CreateProduct

