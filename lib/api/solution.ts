export async function getSolution(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/resolution/${id}`
  );
  if (!response.ok) throw new Error("Faild to fetct Solution ID");
  const data = await response.json();
  return data.data;
}

export async function addSolution(
  id: number,
  task: {
    file_paths?: string[];
    images?: File[];
    solution: string;
  }
) {
  try {
    // สร้าง payload แบบ JSON (ขนาดเล็กกว่า FormData)
    const formData = new FormData();
    formData.append("solution", task.solution);

    // เพิ่มรูปภาพ (ถ้ามี)
    if (task.images && task.images.length > 0) {
      task.images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });
    }

    // เพิ่ม base64 images (ถ้ามี)
    if (task.file_paths && task.file_paths.length > 0) {
      task.file_paths.forEach((base64, index) => {
        // แปลง base64 เป็น Blob
        const byteCharacters = atob(base64.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        formData.append("images", blob, `image_${index}.jpg`);
      });
    }

    console.log("API FormData being sent");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/resolution/create/${id}`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Create failed:", response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const result = await response.json();
    console.log("Create API Response:", result);
    return result;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

export async function updateSolution(
  id: number,
  solutionData: {
    solution: string;
    images?: File[];
    file_paths?: string[];
    existing_images?: string[];
  }
) {
  try {
    const formData = new FormData();
    formData.append("solution", solutionData.solution);

    // เพิ่มรูปภาพใหม่ (ถ้ามี)
    if (solutionData.images && solutionData.images.length > 0) {
      solutionData.images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });
    }

    // เพิ่ม base64 images (ถ้ามี) - สำหรับกรณีที่ยังต้องการใช้
    if (solutionData.file_paths && solutionData.file_paths.length > 0) {
      solutionData.file_paths.forEach((base64, index) => {
        // แปลง base64 เป็น Blob
        const byteCharacters = atob(base64.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        formData.append("images", blob, `image_${index}.jpg`);
      });
    }

    // เพิ่มลิงค์รูปภาพเดิม (ให้ backend จัดการ)
    if (solutionData.existing_images && solutionData.existing_images.length > 0) {
      formData.append("image_urls", JSON.stringify(solutionData.existing_images));
      console.log("Sending existing image URLs to API:", solutionData.existing_images);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/resolution/update/${id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update failed:", response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("Update API Response:", result);
    return result;
  } catch (error) {
    console.error("Error updating solution:", error);
    throw error;
  }
}

export async function deleteSolution(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/resolution/delete/${id}`,
    {
      method: "DELETE",
    }
  );
  return response.ok;
}
