"""
Serviço de geração de parecer investigativo automatizado.
Simula análise baseada em regras — estrutura pronta para integração real de IA.
"""
from datetime import datetime
from app.models.fraud_alert import FraudAlert


def generate_investigation_report(alert: FraudAlert) -> dict:
    """
    Gera parecer investigativo fake baseado em regras simples.
    Em produção, este endpoint chamaria um LLM (ex: Claude, GPT-4).
    """
    score = alert.risk_score
    fraud_type = alert.fraud_type
    amount = alert.amount or 0
    user_name = alert.user.name if alert.user else "Cliente"

    # Determinar nível de risco
    if score >= 85:
        risk_level = "CRÍTICO"
        urgency = "ação imediata recomendada"
    elif score >= 70:
        risk_level = "ALTO"
        urgency = "análise prioritária recomendada"
    elif score >= 50:
        risk_level = "MÉDIO"
        urgency = "monitoramento contínuo recomendado"
    else:
        risk_level = "BAIXO"
        urgency = "acompanhamento padrão recomendado"

    # Gerar contexto baseado no tipo de fraude
    context_map = {
        "Fraude Transacional": (
            f"Identificamos padrões atípicos nas transações do cliente {user_name}. "
            f"O volume transacionado de R$ {amount:,.2f} diverge significativamente do perfil histórico. "
            "Múltiplas operações em janela temporal reduzida sugerem uso automatizado ou acesso não autorizado à conta."
        ),
        "Lavagem de Dinheiro": (
            f"A análise do cliente {user_name} revela estruturação de valores consistente com técnicas de layering. "
            f"As movimentações de R$ {amount:,.2f} apresentam fragmentação característica de operações de lavagem. "
            "Recomenda-se comunicação ao COAF caso confirmada a suspeita."
        ),
        "Cadastro Suspeito": (
            f"Os dados cadastrais do cliente {user_name} apresentam inconsistências relevantes. "
            "Documentos com indícios de adulteração e informações conflitantes entre diferentes fontes de verificação. "
            "Score biométrico abaixo do limiar de confiança estabelecido."
        ),
        "Comportamento Atípico": (
            f"O comportamento transacional de {user_name} apresenta anomalias estatisticamente significativas. "
            f"Operações realizadas em horários e localizações incompatíveis com o histórico do cliente. "
            "Dispositivos não reconhecidos e geolocalização inconsistente detectados."
        ),
        "Outros": (
            f"A análise do alerta para o cliente {user_name} identificou indicadores de risco não categorizados. "
            "Recomenda-se investigação manual aprofundada para classificação adequada do caso."
        ),
    }

    context = context_map.get(fraud_type, context_map["Outros"])

    # Recomendação baseada no score
    if score >= 85:
        recommendation = (
            "BLOQUEIO PREVENTIVO IMEDIATO da conta. Contato com o cliente para verificação de identidade. "
            "Registro do caso no sistema de prevenção a fraudes. Comunicação à área jurídica se confirmado."
        )
    elif score >= 70:
        recommendation = (
            "Suspensão temporária das operações de alto valor. Solicitação de documentação complementar ao cliente. "
            "Monitoramento intensivo por 72 horas. Revisão dos limites operacionais."
        )
    elif score >= 50:
        recommendation = (
            "Acompanhamento reforçado nas próximas transações. Validação adicional para operações acima de R$ 5.000. "
            "Notificação interna para equipe de risco."
        )
    else:
        recommendation = (
            "Manter monitoramento padrão. Registrar ocorrência para análise de padrões futuros. "
            "Nenhuma ação restritiva imediata necessária."
        )

    summary = (
        f"PARECER INVESTIGATIVO AUTOMATIZADO\n\n"
        f"Alerta: {alert.alert_code} | Tipo: {fraud_type} | Score: {score}/100\n\n"
        f"ANÁLISE:\n{context}\n\n"
        f"NÍVEL DE RISCO: {risk_level}\n"
        f"Situação: {urgency.capitalize()}.\n\n"
        f"RECOMENDAÇÃO:\n{recommendation}"
    )

    return {
        "alert_id": alert.id,
        "summary": summary,
        "risk_level": risk_level,
        "recommendation": recommendation,
        "generated_at": datetime.utcnow(),
    }
