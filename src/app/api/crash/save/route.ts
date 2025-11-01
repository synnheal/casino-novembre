import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, betAmount, winAmount, result, crashPoint } = body;

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

    // Sauvegarder dans la BDD
    await prisma.casinoGame.create({
      data: {
        userId: decoded.userId,
        gameType: 'crash',
        betAmount: BigInt(betAmount),
        winAmount: BigInt(winAmount),
        result: {
          type: result,
          crashPoint,
        },
      },
    });

    // Mettre à jour les stats
    const stats = await prisma.casinoStats.findUnique({
      where: { userId: decoded.userId },
    });

    if (stats) {
      await prisma.casinoStats.update({
        where: { userId: decoded.userId },
        data: {
          totalGames: stats.totalGames + 1,
          totalWagered: stats.totalWagered + BigInt(betAmount),
          totalWon: stats.totalWon + BigInt(winAmount),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API /api/crash/save:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
