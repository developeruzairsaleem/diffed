import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// REGISTER CUSTOMER PROFILE
export async function POST(request: NextRequest) {
    try {
        const cookieUserInfo = await verifyToken(request);
        if(!cookieUserInfo) {
            return NextResponse.json('user access not authorized, log In', {status: 401});
        }

        const existingCustomerProfile = await prisma.customer.findFirst({
            where: {userId: cookieUserInfo.id}
        });

        if(existingCustomerProfile) {
            return NextResponse.json({error: 'You already have a provider profile!'}, {status: 400})
        }

        const body = await request.json();
        const customer = await prisma.customer.create({
            data: {
                ...body,
                user: {connect: {id: cookieUserInfo.id}}
            }
        });
        return NextResponse.json(customer, {status: 201});
    } catch(err: any) {
        return NextResponse.json({error: err.message}, {status: 500})
    }
}