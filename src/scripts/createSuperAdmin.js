import { configDotenv } from "dotenv";
import prisma from "../config/prismaClient.js";
import bcrypt from "bcrypt";

configDotenv();

class SuperAdminCreator {
  constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
  }

  async createSuperAdmin() {
    try {
      // Check if we should create super admin
      const shouldCreate = process.env.CREATE_SUPER_ADMIN === "true";
      if (!shouldCreate) {
        console.log(
          "Super admin creation is disabled in environment variables"
        );
        return;
      }

      const superAdminData = {
        email: process.env.SUPER_ADMIN_EMAIL,
        password: process.env.SUPER_ADMIN_PASSWORD,
        username: process.env.SUPER_ADMIN_USERNAME || "superadmin",
        role: "",
      };

      // Validate required fields
      if (!superAdminData.email || !superAdminData.password) {
        console.log(
          "Super admin email or password not provided in environment variables"
        );
        return;
      }

      // Check if super admin already exists
      const existingAdmin = await prisma.user.findFirst({
        where: {
          OR: [
            { email: superAdminData.email },
            { username: superAdminData.username },
            { role: "SUPER_ADMIN" },
          ],
        },
      });

      if (existingAdmin) {
        console.log("Super admin already exists:", existingAdmin.email);

        // Update password if it's different
        const isPasswordCorrect = await bcrypt.compare(
          superAdminData.password,
          existingAdmin.passwordHash
        );

        if (!isPasswordCorrect) {
          const newPasswordHash = bcrypt.hashSync(superAdminData.password, 10);
          await prisma.user.update({
            where: { id: existingAdmin.id },
            data: { passwordHash: newPasswordHash },
          });
          console.log("Super admin password updated");
        }

        return;
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(superAdminData.password, 10);
      // Create new super admin
      const superAdmin = await prisma.user.create({
        data: {
          email: superAdminData.email,
          username: superAdminData.username,
          passwordHash: hashedPassword,
          role: "SUPER_ADMIN",
        },
      });

      console.log("Super admin created successfully:");
      console.log("- Email:", superAdmin.email);
      console.log("- Username:", superAdmin.username);
      console.log("- Role:", superAdmin.role);
      console.log("- ID:", superAdmin.id);

      // In production, don't log the password
      if (!this.isProduction) {
        console.log("- Password:", superAdminData.password);
      }
    } catch (error) {
      console.error("Error creating super admin:", error.message);

      // Handle specific Prisma errors
      if (error.code === "P2002") {
        console.error("A user with this email or username already exists");
      }
    }
  }

  /**
   * Disconnect Prisma client
   */
  async disconnect() {
    await prisma.$disconnect();
  }

  /**
   * Run the super admin creation process
   */
  async run() {
    try {
      await this.createSuperAdmin();
      await this.disconnect();
    } catch (error) {
      console.error("Super admin creation process failed:", error.message);
      await this.disconnect();
      process.exit(1);
    }
  }
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const creator = new SuperAdminCreator();
  creator.run();
}
export default SuperAdminCreator;
