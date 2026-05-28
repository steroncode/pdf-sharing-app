# PDF Share Connect - Design Document

## Overview
A mobile app that enables teachers to share PDF learning materials and students to browse and download them. The app features role-based access with distinct teacher and student experiences.

## Screen List

### Authentication & Onboarding
1. **Role Selection Screen** - User selects whether they are a Teacher or Student
2. **Login Screen** - Email/password login for both roles

### Teacher Screens
3. **Teacher Home Screen** - Dashboard showing PDFs posted by the teacher
4. **Upload PDF Screen** - Form to add new PDF with title, description, and link
5. **PDF Detail Screen** - View details of a posted PDF with edit/delete options

### Student Screens
6. **Student Home Screen** - Browse all available PDFs posted by teachers
7. **PDF Detail Screen** - View PDF details and download button
8. **Downloads Screen** - View downloaded PDFs

## Primary Content and Functionality

### Role Selection Screen
- Two large buttons: "I'm a Teacher" and "I'm a Student"
- Simple, clear visual distinction
- No authentication required at this stage

### Login Screen
- Email input field
- Password input field
- Login button
- Link to create account (if needed)
- Displays role at top for context

### Teacher Home Screen
- List of PDFs posted by this teacher
- Each item shows: Title, Description, Upload date, Download count
- Floating action button (FAB) to add new PDF
- Pull-to-refresh to reload list
- Edit/Delete options on each item (swipe or long-press)

### Upload PDF Screen
- Title input (required)
- Description input (optional)
- PDF Link input (required) - accepts direct PDF URLs
- Subject/Category dropdown (optional)
- Submit button
- Cancel button
- Form validation before submission

### Student Home Screen
- Grid or list view of all available PDFs from all teachers
- Filter by subject/category (optional)
- Search functionality to find PDFs
- Each item shows: Title, Teacher name, Description, Download count
- Tap to view details

### PDF Detail Screen (Student)
- Full PDF title and description
- Teacher/uploader name
- Upload date
- Download button (prominent)
- View in app option (if applicable)
- Share button

### Downloads Screen
- List of downloaded PDFs
- Ability to open, delete, or share downloaded files
- Shows file size and download date

## Key User Flows

### Teacher Flow
1. Teacher opens app → Role Selection
2. Selects "I'm a Teacher" → Login Screen
3. Logs in → Teacher Home Screen (empty initially)
4. Taps FAB → Upload PDF Screen
5. Enters title, description, PDF link → Submits
6. PDF appears in Teacher Home Screen
7. Can edit/delete from list or detail view

### Student Flow
1. Student opens app → Role Selection
2. Selects "I'm a Student" → Login Screen
3. Logs in → Student Home Screen
4. Browses list of available PDFs
5. Taps on PDF → PDF Detail Screen
6. Taps "Download" → PDF saved to device
7. Can access downloaded PDFs from Downloads Screen

## Color Choices

| Element | Color | Usage |
|---------|-------|-------|
| Primary | #2563EB (Blue) | Buttons, highlights, accents |
| Background | #FFFFFF (Light) / #0F172A (Dark) | Screen backgrounds |
| Surface | #F3F4F6 (Light) / #1E293B (Dark) | Cards, elevated surfaces |
| Text Primary | #1F2937 (Dark) / #F3F4F6 (Light) | Main text |
| Text Secondary | #6B7280 (Gray) | Secondary text, descriptions |
| Success | #10B981 (Green) | Download success, confirmations |
| Danger | #EF4444 (Red) | Delete actions, errors |
| Border | #E5E7EB (Light) / #334155 (Dark) | Dividers, borders |

## Navigation Structure

```
Role Selection
├── Teacher Path
│   ├── Login
│   └── Teacher Home
│       ├── Upload PDF Screen
│       └── PDF Detail Screen (edit/delete)
└── Student Path
    ├── Login
    └── Tabs
        ├── Browse (Student Home)
        │   └── PDF Detail Screen (download)
        └── Downloads
```

## Key Interactions

- **Pull-to-refresh**: Available on home screens to reload PDF list
- **Floating Action Button**: Teacher home screen for quick PDF upload
- **Swipe/Long-press**: Edit and delete options on teacher's PDF list
- **Haptic Feedback**: Button presses, successful downloads, deletions
- **Loading States**: Show spinner during PDF list fetch and downloads
- **Error Handling**: Display toast messages for failed uploads/downloads
