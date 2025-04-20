## 📝 FlexiForm

FlexiForm is a clean and easy-to-use form builder built with modern web tools. It lets users create, customize, and manage forms through a simple drag-and-drop interface. Whether you're collecting feedback, registrations, or survey data, FlexiForm helps you get started quickly with a responsive and polished experience.

---

## 🌟 Features

- **Drag & Drop Builder** – Easily arrange form fields just the way you want
- **Live Preview** – See changes in real time as you build your form
- **Field Types Supported**:

  - Text, Title, Paragraph, Number
  - Dropdowns with options
  - Checkboxes with custom labels
  - Date pickers, spacers, and separators

- **Form Management**:

  - Create, edit, publish, and delete forms
  - View and export responses

- **Customization Options**:

  - Validation rules per field
  - Custom error messages
  - Conditional visibility

- **Sharing**:

  - Share forms via unique links
  - Control who can access

- **User Experience**:

  - Dark mode available
  - Fully responsive on all devices

- **Authentication & Security**:
  - Sign-in support with Clerk
  - Secure submission handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: Prisma with PostgreSQL
- **Authentication**: Clerk
- **Form Builder**: DND Kit for drag-and-drop functionality
- **State Management**: React Context API
- **Icons**: Lucide React + React Icons
- **UI Components**: Custom components with Radix UI primitives

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/flexiform.git
cd flexiform
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```env
DATABASE_URL="your-database-url"
CLERK_SECRET_KEY="your-clerk-secret"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

## 📁 Project Structure

```
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── fields/         # Form field components
│   ├── ui/            # UI components
│   └── hooks/         # Custom React hooks
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── schemas/            # Validation schemas
```

## 👨‍💻 Author

Abu Hasan Rumi

- Portfolio: [itsrumi.com](https://itsrumi.com)
- GitHub: [@abuhasanrumi](https://github.com/abuhasanrumi)
- LinkedIn: [Abu Hasan Rumi](https://www.linkedin.com/in/abu-hasan-rumi/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Badges

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-lightgrey)
![License](https://img.shields.io/badge/License-MIT-green)
