import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./RegistrationForm.scss";

const registrationSchema = z
  .object({
    fornavn: z.string().min(1, "Fornavn er påkrævet"),

    efternavn: z.string().min(1, "Efternavn er påkrævet"),

    email: z.string().email("Din emailadresse er ugyldig"),
    // kode
    password: z
      .string()
      .min(8, "Password skal være mindst 8 tegn")
      .regex(/[0-9]/, "Password skal indeholde mindst ét tal"),

    gentagPassword: z.string(),

    foedselsdato: z.coerce.date().refine((date) => {
      const today = new Date();
      let age = today.getFullYear() - date.getFullYear();
      const m = today.getMonth() - date.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
        age--;
      }
      return age >= 18;
    }, "Du skal være mindst 18 år"),

    telefonnummer: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[0-9+\s]{8,15}$/.test(val),
        "Du skal have mindst 8 cifre i dit telefonnummer"
      ),
  })
  .refine((data) => data.password === data.gentagPassword, {
    message: "Passwords matcher ikke",
    path: ["gentagPassword"],
  });

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = (data) => {
    console.log("Form data:", data);
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register("fornavn")} placeholder="Fornavn" />
        <p>{errors.fornavn?.message}</p>
      </div>

      <div>
        <input {...register("efternavn")} placeholder="Efternavn" />
        <p>{errors.efternavn?.message}</p>
      </div>

      <div>
        <input {...register("email")} placeholder="Email" />
        <p>{errors.email?.message}</p>
      </div>

      <div>
        <input type="password" {...register("password")} placeholder="Password" />
        <p>{errors.password?.message}</p>
      </div>

      <div>
        <input
          type="password"
          {...register("gentagPassword")}
          placeholder="Gentag password"
        />
        <p>{errors.gentagPassword?.message}</p>
      </div>

      <div>
        <input type="date" {...register("foedselsdato")} />
        <p>{errors.foedselsdato?.message}</p>
      </div>

      <div>
        <input
          {...register("telefonnummer")}
          placeholder="Telefonnummer (valgfrit)"
        />
        <p>{errors.telefonnummer?.message}</p>
      </div>

      <button type="submit">Registrer</button>
    </form>
  );
}
