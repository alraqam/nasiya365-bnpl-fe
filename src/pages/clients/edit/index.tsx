import { Button, Stack, Typography, InputAdornment, Grid, Card, MenuItem, IconButton, Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Title from 'src/@core/components/title'
import { Box, styled } from '@mui/system'
import Icon from 'src/@core/components/icon/icon'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'
import InputMask from 'react-input-mask'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import Dropzone from 'react-dropzone'
import { useRouter } from 'next/router'

const DropzoneSection = styled('section')(({ theme }) => ({
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '16px 0 12px 0',
  minHeight: '264px',
  maxHeight: '264px',
  position: 'relative',
  overflow: 'hidden'
}))

const ImagePreview = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: '264px',
  maxHeight: '264px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover .hover-overlay': {
    opacity: 1
  }
})

const HoverOverlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  opacity: 0,
  transition: 'opacity 0.3s ease'
})

const EditClient = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const [form, setForm] = useState({
    surname: '',
    name: '',
    patronymic: '',
    phones: [''],
    email: '',
    gender: '',
    workplace: '',
    profession: '',
    passportSeries: '',
    passportIssuer: '',
    passportIssueDate: null as Date | null,
    birthDate: null as Date | null,
    birthPlace: '',
    address: '',
    registeredAddress: '',
    guarantor: '',
    guarantorPhones: [''],
    status: '',
    applicationFile: null as File | null,
    passportFile: null as File | null
  })
  const { id } = router.query

  useEffect(() => {
    // Api call goes here to update fields with existing values
  }, [id])

  const [filePreviews, setFilePreviews] = useState({
    application: null as string | null,
    passport: null as string | null
  })

  const handleChange = (event: React.ChangeEvent<HTMLElement>) => {
    if (
      'value' in event.target &&
      'name' in event.target &&
      typeof event.target.value === 'string' &&
      typeof event.target.name === 'string'
    ) {
      setForm({
        ...form,
        [event.target.name]: event.target.value
      })
    }
  }

  const handleChangePhone = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPhones = [...form.phones]
    newPhones[index] = event.target.value
    setForm(prev => ({ ...prev, phones: newPhones }))
  }

  const handleChangeGuarantorPhone = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPhones = [...form.guarantorPhones]
    newPhones[index] = event.target.value
    setForm(prev => ({ ...prev, guarantorPhones: newPhones }))
  }

  const addPhone = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setForm({ ...form, phones: [...form.phones, ''] })
  }

  const removePhone = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newPhones = form.phones.filter((_, i) => i !== index)
    setForm({ ...form, phones: newPhones })
  }

  const addGuarantorPhone = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setForm({ ...form, guarantorPhones: [...form.guarantorPhones, ''] })
  }

  const removeGuarantorPhone = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newPhones = form.guarantorPhones.filter((_, i) => i !== index)
    setForm({ ...form, guarantorPhones: newPhones })
  }

  const handleFileDrop = (acceptedFiles: File[], fileType: 'application' | 'passport') => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file)

      setForm(prev => ({
        ...prev,
        [fileType === 'application' ? 'applicationFile' : 'passportFile']: file
      }))

      setFilePreviews(prev => ({
        ...prev,
        [fileType]: previewUrl
      }))
    }
  }

  const removeFile = (fileType: 'application' | 'passport') => {
    setForm(prev => ({
      ...prev,
      [fileType === 'application' ? 'applicationFile' : 'passportFile']: null
    }))

    if (filePreviews[fileType]) {
      URL.revokeObjectURL(filePreviews[fileType]!)
    }

    setFilePreviews(prev => ({
      ...prev,
      [fileType]: null
    }))
  }

  const renderDropzone = (fileType: 'application' | 'passport', title: string) => {
    const preview = filePreviews[fileType]

    return (
      <Card sx={{ padding: '16px 20px 20px' }}>
        <Typography variant='h5'>{title}</Typography>
        <Dropzone
          onDrop={acceptedFiles => handleFileDrop(acceptedFiles, fileType)}
          accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
          multiple={false}
        >
          {({ getRootProps, getInputProps }) => (
            <DropzoneSection
              sx={{ padding: preview ? '0px' : '48px', border: preview ? 'none' : '2px dashed #2F2B3D1F' }}
            >
              <div
                {...getRootProps()}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '264px',
                  maxHeight: '264px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <input {...getInputProps()} />

                {preview ? (
                  <ImagePreview>
                    <img
                      src={preview}
                      alt='Preview'
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        position: 'absolute',
                        objectFit: 'contain'
                      }}
                    />
                    <HoverOverlay className='hover-overlay'>
                      <Button
                        variant='contained'
                        sx={theme => ({
                          backgroundColor: '#fff',
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: '#fff'
                          }
                        })}
                      >
                        Faylni yuklash
                      </Button>
                      <IconButton
                        sx={{
                          backgroundColor: '#fff',
                          borderRadius: '6px',
                          height: '44px',
                          width: '44px',
                          '&:hover': {
                            backgroundColor: '#fff'
                          }
                        }}
                        onClick={e => {
                          e.stopPropagation()
                          removeFile(fileType)
                        }}
                      >
                        <Icon svg='/icons/trash.svg' color='#FF4747' width={18} height={18} />
                      </IconButton>
                    </HoverOverlay>
                  </ImagePreview>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <IconButton sx={{ backgroundColor: '#EEEDF0', borderRadius: '6px' }}>
                      <Icon svg='/icons/upload.svg' color='#808390' width={24} height={24} />
                    </IconButton>
                    <Typography variant='body1' align='center'>
                      Faylni shu yerga torting yoki suring
                    </Typography>
                    <Typography variant='body1' sx={{ color: '#ccc' }}>
                      Yoki
                    </Typography>
                    <Button variant='tonal'>Faylni yuklash</Button>
                  </div>
                )}
              </div>
            </DropzoneSection>
          )}
        </Dropzone>
        <Alert severity='warning' icon={false}>
          Fayl hajmi 2 MB dan katta bo'lmasligi kerak va quyidagi formatlar qabul qilinadi: JPG, PNG
        </Alert>
      </Card>
    )
  }

  const onCancel = () => {
    setForm({
      surname: '',
      name: '',
      patronymic: '',
      phones: [''],
      email: '',
      gender: '',
      workplace: '',
      profession: '',
      passportSeries: '',
      passportIssuer: '',
      passportIssueDate: null,
      birthDate: null,
      birthPlace: '',
      address: '',
      registeredAddress: '',
      guarantor: '',
      guarantorPhones: [''],
      status: '',
      applicationFile: null,
      passportFile: null
    })
    setFilePreviews({ application: null, passport: null })
  }

  const onSubmit = async () => {
    console.log(form)
  }

  return (
    <>
      <Stack
        sx={theme => ({
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          height: '100%'
        })}
      >
        <Box display='flex' gap={1}>
          <Title title={t('pages.clients')} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
          <Typography variant='h6' color='#7F7F7FE5'>
            /
          </Typography>
          <Title title={t('client')} />
        </Box>

        <Grid container flex={1} spacing={4}>
          {/* Left side */}
          <Grid item xs={12} md={8}>
            <Card sx={{ padding: '20px', backgroundColor: '#fff' }}>
              <Grid container spacing={4}>
                {/* Surname */}
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>
                    Familya <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <CustomTextField fullWidth name='surname' value={form.surname} onChange={handleChange} />
                </Grid>

                {/* Name */}
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>
                    Ism <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <CustomTextField fullWidth name='name' value={form.name} onChange={handleChange} />
                </Grid>

                {/* Patronymic */}
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Sharif</Typography>
                  <CustomTextField fullWidth name='patronymic' value={form.patronymic} onChange={handleChange} />
                </Grid>

                {/* Phone */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Telefon raqami</Typography>
                  {form.phones.map((phone, index) => (
                    <InputMask
                      key={index}
                      mask='99 999 99 99'
                      value={phone}
                      onChange={e => handleChangePhone(e, index)}
                    >
                      {(inputProps: any) => (
                        <CustomTextField
                          {...inputProps}
                          fullWidth
                          placeholder='00 000 00 00'
                          sx={{ '& .MuiInputBase-root': { paddingRight: '1px' } }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position='start'
                                sx={{
                                  marginRight: '4px',
                                  '& .MuiTypography-root': {
                                    fontSize: '15px',
                                    lineHeight: '21px'
                                  }
                                }}
                              >
                                +998
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position='end' sx={{ margin: '2px' }}>
                                <Button
                                  variant='text'
                                  sx={{
                                    minWidth: '32px',
                                    width: '32px',
                                    height: '32px',
                                    padding: '0px',
                                    borderRadius: '8px',
                                    backgroundColor: index === 0 ? '#7367F01A' : 'transparent',
                                    '&:hover': {
                                      backgroundColor: index === 0 ? '#7367F033' : '#FF474755'
                                    }
                                  }}
                                  onClick={index === 0 ? addPhone : removePhone(index)}
                                >
                                  {index === 0 ? (
                                    <Icon svg='/icons/plus.svg' color='#7367F0' width={20} height={20} />
                                  ) : (
                                    <Icon svg='/icons/trash.svg' color='#FF4747' width={18} height={18} />
                                  )}
                                </Button>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    </InputMask>
                  ))}
                </Grid>

                {/* Email */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Email</Typography>
                  <CustomTextField fullWidth name='email' value={form.email} onChange={handleChange} />
                </Grid>

                {/* Gender */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Jinsni tanlang</Typography>
                  <CustomTextField select fullWidth name='gender' value={form.gender} onChange={handleChange}>
                    <MenuItem value='male'>Erkak</MenuItem>
                    <MenuItem value='female'>Ayol</MenuItem>
                  </CustomTextField>
                </Grid>

                {/* Workplace */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Ish joyi</Typography>
                  <CustomTextField fullWidth name='workplace' value={form.workplace} onChange={handleChange} />
                </Grid>

                {/* Profession */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Kasbi</Typography>
                  <CustomTextField fullWidth name='profession' value={form.profession} onChange={handleChange} />
                </Grid>

                {/* Passport series */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Pasport seriyasi</Typography>
                  <CustomTextField
                    fullWidth
                    name='passportSeries'
                    value={form.passportSeries}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Passport Issuer */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Kim tomonidan berilgan</Typography>
                  <CustomTextField
                    fullWidth
                    name='passportIssuer'
                    value={form.passportIssuer}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Passport issue date */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Qachon berilgan</Typography>
                  <DatePickerWrapper
                    sx={theme => ({
                      [theme.breakpoints.down('md')]: {
                        width: '100%'
                      }
                    })}
                  >
                    <DatePicker
                      selected={form.passportIssueDate}
                      onChange={date => setForm({ ...form, passportIssueDate: date })}
                      dateFormat='dd.MM.yyyy'
                      customInput={
                        <CustomTextField
                          fullWidth
                          variant='filled'
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <Icon svg='/icons/date.svg' color='#2F2B3D' width={20} height={20} />
                              </InputAdornment>
                            )
                          }}
                        />
                      }
                    />
                  </DatePickerWrapper>
                </Grid>

                {/* Birth date */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Tu'gilgan kuni</Typography>
                  <DatePickerWrapper
                    sx={theme => ({
                      [theme.breakpoints.down('md')]: {
                        width: '100%'
                      }
                    })}
                  >
                    <DatePicker
                      selected={form.birthDate}
                      onChange={date => setForm({ ...form, birthDate: date })}
                      dateFormat='dd.MM.yyyy'
                      customInput={
                        <CustomTextField
                          fullWidth
                          variant='filled'
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <Icon svg='/icons/date.svg' color='#2F2B3D' width={20} height={20} />
                              </InputAdornment>
                            )
                          }}
                        />
                      }
                    />
                  </DatePickerWrapper>
                </Grid>

                {/* Birth place */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Tug'ilgan joyi</Typography>
                  <CustomTextField fullWidth name='birthPlace' value={form.birthPlace} onChange={handleChange} />
                </Grid>

                {/* Address */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Yashash manzili</Typography>
                  <CustomTextField fullWidth name='address' value={form.address} onChange={handleChange} />
                </Grid>

                {/* Registered Address */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Ro'yxatdan o'tgan manzili</Typography>
                  <CustomTextField
                    fullWidth
                    name='registeredAddress'
                    value={form.registeredAddress}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Guarantor */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Kafil (F.I.O)</Typography>
                  <CustomTextField fullWidth name='guarantor' value={form.guarantor} onChange={handleChange} />
                </Grid>

                {/* Guarantor Phone */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Kafil telefon raqami</Typography>
                  {form.guarantorPhones.map((phone, index) => (
                    <InputMask
                      key={index}
                      mask='99 999 99 99'
                      value={phone}
                      onChange={e => handleChangeGuarantorPhone(e, index)}
                    >
                      {(inputProps: any) => (
                        <CustomTextField
                          {...inputProps}
                          fullWidth
                          placeholder='00 000 00 00'
                          sx={{ '& .MuiInputBase-root': { paddingRight: '1px' } }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position='start'
                                sx={{
                                  marginRight: '4px',
                                  '& .MuiTypography-root': {
                                    fontSize: '15px',
                                    lineHeight: '21px'
                                  }
                                }}
                              >
                                +998
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position='end' sx={{ margin: '2px' }}>
                                <Button
                                  variant='text'
                                  sx={{
                                    minWidth: '32px',
                                    width: '32px',
                                    height: '32px',
                                    padding: '0px',
                                    borderRadius: '8px',
                                    backgroundColor: index === 0 ? '#7367F01A' : 'transparent',
                                    '&:hover': {
                                      backgroundColor: index === 0 ? '#7367F033' : '#FF474755'
                                    }
                                  }}
                                  onClick={index === 0 ? addGuarantorPhone : removeGuarantorPhone(index)}
                                >
                                  {index === 0 ? (
                                    <Icon svg='/icons/plus.svg' color='#7367F0' width={20} height={20} />
                                  ) : (
                                    <Icon svg='/icons/trash.svg' color='#FF4747' width={18} height={18} />
                                  )}
                                </Button>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    </InputMask>
                  ))}
                </Grid>

                {/* Status */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography variant='body1'>Statusni tanlang</Typography>
                  <CustomTextField select fullWidth name='status' value={form.status} onChange={handleChange}>
                    <MenuItem value='active'>Aktiv</MenuItem>
                    <MenuItem value='inactive'>Aktiv emas</MenuItem>
                  </CustomTextField>
                </Grid>
              </Grid>
            </Card>
            <Stack
              sx={{
                marginTop: '24px',
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: '12px',
                flexDirection: 'row'
              }}
            >
              <Button variant='outlined' onClick={onCancel}>
                Bekor qilish
              </Button>
              <Button variant='contained' onClick={onSubmit}>
                Saqlash
              </Button>
            </Stack>
          </Grid>

          {/* Right side */}
          <Grid item xs={12} md={4}>
            <Stack direction='column' gap={4}>
              {/* Application */}
              {renderDropzone('application', 'Tilxat')}

              {/* Passport copy */}
              {renderDropzone('passport', 'Pasport nusxasi / ID karta')}
            </Stack>
          </Grid>
        </Grid>
        <Stack
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: '12px',
            flexDirection: 'row'
          }}
        >
          <Button variant='outlined' onClick={onCancel} sx={{ flex: 1 }}>
            Bekor qilish
          </Button>
          <Button variant='contained' onClick={onSubmit} sx={{ flex: 1 }}>
            Saqlash
          </Button>
        </Stack>
      </Stack>
    </>
  )
}

export default EditClient
