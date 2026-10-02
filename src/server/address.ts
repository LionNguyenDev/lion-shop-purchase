import { serverEnv } from './env';
import { HttpError } from './http';

// Vietnam administrative units after the 07/2025 merge (34 provinces → wards), from provinces.open-api.vn
export interface Division {
  code: number;
  name: string;
}

const ONE_DAY = 60 * 60 * 24;

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${serverEnv.addressApiUrl}${path}`, { next: { revalidate: ONE_DAY } });
  if (res.status === 404) throw new HttpError(404, 'Không tìm thấy địa chỉ');
  if (!res.ok) throw new HttpError(502, 'Không lấy được dữ liệu địa chỉ, vui lòng thử lại');
  return res.json() as Promise<T>;
}

const pick = ({ code, name }: Division): Division => ({ code, name });

export async function getProvinces() {
  const data = await fetchJson<Division[]>('/p/');
  return data.map(pick);
}

export async function getWards(provinceCode: number) {
  const data = await fetchJson<Division & { wards: Division[] }>(`/p/${provinceCode}?depth=2`);
  return { province: pick(data), wards: data.wards.map(pick) };
}

/** Resolves codes to names and checks the ward belongs to the province. */
export async function resolveAddress(provinceCode: number, wardCode: number) {
  const { province, wards } = await getWards(provinceCode);
  const ward = wards.find((item) => item.code === wardCode);
  if (!ward) throw new HttpError(400, 'Phường/xã không thuộc tỉnh/thành phố đã chọn');
  return { province, ward };
}
