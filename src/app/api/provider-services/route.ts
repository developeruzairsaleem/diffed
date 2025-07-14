// app/api/provider-services/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

//  POST - Create a new ProviderService
export async function POST(request: NextRequest) {
  try {
    const cookieUserInfo = await verifyToken(request);
    if (!cookieUserInfo) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { serviceId, price, duration } = await request.json();

    if (!serviceId || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const provider = await prisma.provider.findUnique({
      where: { userId: cookieUserInfo.id },
    });

    if (!provider) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 });
    }

    const providerService = await prisma.providerService.create({
      data: {
        providerId: provider.id,
        serviceId,
        price,
        duration,
      },
      include: {
        provider: true,
        service: true,
      },
    });

    return NextResponse.json(providerService, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

//  GET - Get all Provider Services with related details (for landing page or admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const allProviderServices = await prisma.providerService.findMany({
      include: {
        service: true,
        provider: {
          include: {
            user: {
              select: { profileImage: true },
            },
          },
        },
      },
    });

    return NextResponse.json(allProviderServices, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
