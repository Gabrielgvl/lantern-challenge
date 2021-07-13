import { resolver, SecurePassword } from "blitz";
import db from "db";
import { Signup } from "app/auth/validations";
import { Role } from "types";

export default resolver.pipe(
  resolver.zod(Signup),
  async ({ email, password, defaultCurrency }, ctx) => {
    const hashedPassword = await SecurePassword.hash(password.trim());
    const user = await db.user.create({
      data: { email: email.toLowerCase().trim(), hashedPassword, role: "USER" },
      select: { id: true, name: true, email: true, role: true },
    });

    const wallet = await db.wallet.create({
      data: { userId: user.id, currencyId: defaultCurrency.id },
    });

    await ctx.session.$create({ userId: user.id, walletId: wallet.id, role: user.role as Role });
    return user;
  }
);
