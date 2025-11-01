import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, amount } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    // Vérifier que le montant est valide
    if (!amount || amount < 10) {
      return NextResponse.json({ error: 'Montant invalide (minimum 10)' }, { status: 400 });
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier les crédits
    if (user.credits < BigInt(amount)) {
      return NextResponse.json({ error: 'Crédits insuffisants' }, { status: 400 });
    }

    // Retirer les crédits
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { credits: user.credits - BigInt(amount) },
    });

    return NextResponse.json({
      success: true,
      balance: updatedUser.credits.toString(),
    });
  } catch (error) {
    console.error('Erreur API /api/crash/bet:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
