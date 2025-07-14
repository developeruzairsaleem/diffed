import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all services
export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      orderBy: { id: 'desc' },
    });

    if (!services || services.length === 0) {
      return NextResponse.json({ error: 'No services found' }, { status: 404 });
    }

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST a new service
export async function POST(request: NextRequest) {
  try {
    const { title, description, image } = await request.json();

    if (!title || !description || !image) {
      return NextResponse.json(
        { error: 'Title, description, and image are required' },
        { status: 400 }
      );
    }

    const newService = await prisma.service.create({
      data: {
        title,
        description,
        image,
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
