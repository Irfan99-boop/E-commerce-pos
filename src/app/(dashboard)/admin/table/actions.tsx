"use server";

import { createClient } from "@/lib/supabase/server";
import { TableFormState } from "@/types/table";
import { tableSchema } from "@/validations/table-validation";

export async function createTable(
  prevState: TableFormState,
  formData: FormData
) {
  console.log("🔵 CREATE TABLE - Start", {
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    status: formData.get("status"),
  }); //Test

  const validatedFields = tableSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: parseInt(formData.get("capacity") as string),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    console.log("🔴 CREATE - Validation failed:", validatedFields.error); //Test

    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }
  console.log("🟢 CREATE - Validation success:", validatedFields.data); //Test

  const supabase = await createClient();

  const { error } = await supabase.from("tables").insert({
    name: validatedFields.data.name,
    description: validatedFields.data.description,
    capacity: validatedFields.data.capacity,
    status: validatedFields.data.status,
  });

  if (error) {
    console.log("🔴 CREATE - Supabase error:", error); //Test
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }
  console.log("🟢 CREATE - Success"); //Test

  return {
    status: "success",
  };
}

export async function updateTable(
  prevState: TableFormState,
  formData: FormData
) {
  console.log("🔵 UPDATE TABLE - Start", {
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    status: formData.get("status"),
  }); //Test

  const validatedFields = tableSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: parseInt(formData.get("capacity") as string),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    console.log("🔴 UPDATE - Validation failed:", validatedFields.error); //Test

    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }
  console.log("🟢 UPDATE - Validation success:", validatedFields.data); //Test

  const supabase = await createClient();

  // Cek user session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  console.log("👤 UPDATE - Current user:", user?.email); //Test

  const { error } = await supabase
    .from("tables")
    .update({
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      capacity: validatedFields.data.capacity,
      status: validatedFields.data.status,
    })
    .eq("id", formData.get("id"));

  if (error) {
    console.log("🔴 UPDATE - Supabase error:", error); //Test
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }
  console.log("🟢 UPDATE - Success"); //Test
  return {
    status: "success",
  };
}

export async function deleteTable(
  prevState: TableFormState,
  formData: FormData
) {
  console.log("🗑️ deleteTable dipanggil dengan ID:", formData.get("id"));

  const supabase = await createClient();

  // Cek user session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  console.log("👤 DELETE - Current user:", user?.email); //test

  // Cek dulu apakah data dengan ID tersebut ada
  const { data: existingData, error: checkError } = await supabase
    .from("tables")
    .select("id")
    .eq("id", formData.get("id"))
    .single();

  console.log("🔍 DELETE - Cek existing data:", existingData); //Test

  if (!existingData) {
    console.log(
      "⚠️ DELETE - Data tidak ditemukan dengan ID:",
      formData.get("id")
    );
  } //test

  const { error } = await supabase
    .from("tables")
    .delete()
    .eq("id", formData.get("id"));

  if (error) {
    console.log("🔴 DELETE - Supabase error:", error); //Test
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }
  console.log("🟢 DELETE - Success"); //Test
  return { status: "success" };
}
